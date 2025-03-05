"use client"

import {FormEvent, useEffect, useRef, useState} from "react";
import {Button, Checkbox, CheckboxChangeEvent, Modal, Select} from "antd";
import {clientDeleteRequest, clientPostRequest} from "@/utils";
import {v4 as uuidv4} from "uuid";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useFetchAllOperations, useFetchAllResources, useFetchAllUsers} from "@/hooks";
import {PermissionFormPropsType, PermissionFormState} from "@/interface";


export default function PermissionForm(props: PermissionFormPropsType) {

    const emptyFormState = {
        resource: '',
        permissions: [],
        userId: '',
        existingPermissions: []
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permissionFormState, setPermissionFormState] = useState<PermissionFormState>(emptyFormState);
    const {users} = useFetchAllUsers();
    const {operations} = useFetchAllOperations();
    const {resources} = useFetchAllResources();

    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                        if (el.id === value) {
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

    const handleAddPermissionSubmit = async () => {
        try {

            const {userId, resource, permissions} = permissionFormState;

            if(!userId || !resource || !permissions.length){
                toast.error("Please fill up the form fields");
                return;
            }

            let isSuccess = false;
            let res;



            for (const permission of permissions) {

                if (permission.type === "existing") continue;

                if (permission.type === "new") {
                    res = await clientPostRequest({
                        endpoint: '/permissions',
                        data: {
                            userId,
                            permissionId: permission.id,
                            resource
                        }
                    })
                }

                if (permission.type === "delete") {
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
                router.push("/permissions");
            }

            handleCancel();

        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            }
        } finally {
            if (props.isEdit) {
                handleCancel();
                setPermissionFormState({...props.initialData})
            }
        }
    }

    const isChecked = (id: string) => {

        const isPermissionExists = permissionFormState.permissions.find((el) => {
            return el.type !== "delete" && el.id === id;
        })

        return !!isPermissionExists;
    }

    useEffect(() => {
        if (props.initialData) {
            setPermissionFormState({...props.initialData});
        }
    }, [props.initialData]);

    
    return (
        <>
            <Button type="primary" onClick={showModal}>
                {props.isEdit ? "Edit" : "Add"}
            </Button>
            <Modal title={props.isEdit ? "Update Permission" : "Add Permission"} open={isModalOpen}
                   onCancel={handleCancel} footer={
                <div className="flex items-center gap-x-2 justify-end">
                    <Button htmlType="button" type="default" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleAddPermissionSubmit}>
                        {props.isEdit ? "Update" : "Add"}
                    </Button>
                </div>
            }>
                <div className="space-y-4">
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

                </div>
            </Modal>
        </>
    )
}