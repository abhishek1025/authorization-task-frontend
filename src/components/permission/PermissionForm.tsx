"use client"

import {FormEvent, useEffect, useState} from "react";
import {Button, Checkbox, CheckboxChangeEvent, Modal, Select} from "antd";
import {clientDeleteRequest, clientGetRequest, clientPostRequest} from "@/utils";
import {OperationType, UserType} from "@/interface";
import {v4 as uuidv4} from "uuid";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type PermissionFormState = {
    userId: string;
    resource: string;
    permissions: {
        id: string;
        type: "new" | "delete" | "existing";
    }[];
    existingPermissions: string[];
}

type PermissionFormPropsType = {
    isEdit: boolean,
    initialData: PermissionFormState
}


export default function PermissionForm(props: PermissionFormPropsType) {

    const emptyFormState = {
        resource: '',
        permissions: [],
        userId: '',
        existingPermissions: []
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [resources, setResources] = useState<string[]>([]);
    const [operations, setOperations] = useState<OperationType[]>([]);
    const [permissionFormState, setPermissionFormState] = useState<PermissionFormState>(emptyFormState);

    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const fetchUsers = async () => {

        const response = await clientGetRequest({
            endpoint: '/users',
        });

        if (response.ok) {
            setUsers(response.data);
            return;
        }
    }

    const fetchResources = async () => {

        const response = await clientGetRequest({
            endpoint: '/resources',
        });

        if (response.ok) {
            setResources(response.data);
            return;
        }
    }

    const fetchOperations = async () => {

        const response = await clientGetRequest({
            endpoint: '/operations',
        });

        if (response.ok) {
            setOperations(response.data);
            return;
        }
    }


    const handlePermissionCheckBoxChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        const value = e.target.value

        if (isChecked) {

            if (!permissionFormState.existingPermissions.includes(value)) {
                    setPermissionFormState((prevState) => {
                        return {
                            ...prevState,
                            permissions: [...prevState.permissions, {
                                id: value, type: "new"
                            }]
                        };
                    })
                return;
            }

            setPermissionFormState((prevState) => {
                return {
                    ...prevState,
                    permissions: prevState.permissions.map((el) => {
                        if(el.id === value){
                            return {
                                ...el,
                                type: "existing"
                            }
                        }

                        return el;
                    })
                };
            })

            return;
        }

        if (props.isEdit && permissionFormState.existingPermissions.includes(value)) {

            setPermissionFormState((prevState) => {
                return {
                    ...prevState, permissions: prevState.permissions.map((item) => {

                        if (item.id === value) {
                            return {
                                ...item,
                                type: 'delete'
                            }
                        }
                        return item;
                    })
                };
            })

            return;
        }


        setPermissionFormState((prevState) => {
            return {
                ...prevState, permissions: prevState.permissions.filter((item) => {
                    return item.id !== value
                })
            };
        })

    }

    const handleAddPermissionSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {

            e.preventDefault();

            let isSuccess = false;
            let res;

            const {userId, resource} = permissionFormState;



            for (const permission of permissionFormState.permissions) {

                if(permission.type === "existing") continue;

                if(permission.type === "new") {
                    res = await clientPostRequest({
                        endpoint: '/permissions',
                        data: {
                            userId,
                            permissionId: permission.id,
                            resource
                        }
                    })
                }

                if(permission.type === "delete") {
                    res = await clientDeleteRequest({
                        endpoint: `/permissions/delete/${userId}/${resource}/${permission.id}`,
                    })
                }


                if (res.ok) {
                    isSuccess = true;
                }

                if (!res.ok) {
                    isSuccess = false;
                    toast.error(res.msg);
                    return;
                }
            }

            if (isSuccess) {
                toast.success(props.isEdit ? "Permission successfully updated!" : "Permission successfully added!");

                setPermissionFormState(emptyFormState)

                handleCancel();

                router.push("/permissions");

                return;
            }

        } catch (e) {

            if (e instanceof Error) {
                toast.error(e.message);
            }
        }
    }

    const isChecked = (id: string)=> {

        const isPermissionExists = permissionFormState.permissions.find((el) => {
            return el.type !== "delete" && el.id === id;
        })

        return !!isPermissionExists;
    }

    useEffect(() => {

        const fetchAllItemsToAddPermssions = async () => {

            await Promise.all([
                fetchOperations(),
                fetchUsers(),
                fetchResources()
            ])
        }

        fetchAllItemsToAddPermssions()

    }, []);

    useEffect(() => {
        if(props.initialData){
            setPermissionFormState(props.initialData);
        }
    }, [props.initialData]);



    return (
        <>
            <Button type="primary" onClick={showModal}>
                {props.isEdit ? "Edit" : "Add"}
            </Button>
            <Modal title="Add Permission" open={isModalOpen} onCancel={handleCancel} footer={
                <div className="flex items-center gap-x-2 justify-end">
                    <Button htmlType="button" type="default" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button htmlType="submit" type="primary" form="add-permission-form">
                        {props.isEdit ? "Update" : "Add"}
                    </Button>
                </div>
            }>
                <form className="space-y-4" onSubmit={handleAddPermissionSubmit} id="add-permission-form">
                    <div>
                        <label htmlFor="user">
                            User
                        </label>
                        <Select
                            id="user"
                            className="w-full"
                            options={[...users.map((user) => {
                                return {
                                    value: user.id,
                                    label: <span> {user.name} ( {user.email} )</span>,
                                }
                            })]}
                            placeholder="Users"
                            onChange={(value) => {
                                setPermissionFormState((prevState) => {
                                    return {...prevState, userId: value};
                                })
                            }}
                            value={permissionFormState.userId}
                            disabled={props.isEdit}
                        />

                    </div>

                    <div>
                        <label htmlFor="resources">
                            Resource
                        </label>
                        <Select
                            id="resources"
                            className="w-full"
                            options={[...resources.map((resource) => {
                                return {
                                    value: resource,
                                    label: resource,
                                }
                            })]}
                            placeholder="Resources"
                            onChange={(value) => {
                                setPermissionFormState((prevState) => {
                                    return {...prevState, resource: value};
                                })
                            }}
                            value={permissionFormState.resource}
                            disabled={props.isEdit}
                        />

                    </div>

                    <div>
                        <label htmlFor="user">
                            Permissions
                        </label>

                        <div className="flex items-center">

                            {
                                operations.map((item) => {
                                    return (
                                        <Checkbox
                                            key={uuidv4()}
                                            value={item.id.toString()}
                                            name={item.operation}
                                            onChange={handlePermissionCheckBoxChange}
                                            checked={isChecked(item.id.toString())}
                                        >
                                            {item.operation}
                                        </Checkbox>
                                    )
                                })
                            }

                        </div>
                    </div>

                </form>
            </Modal>
        </>
    )
}