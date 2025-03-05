"use client"

import {Checkbox, Table} from "antd";
import {OperationType, PermissionsTableItem} from "@/interface";
import { v4 as uuidv4 } from "uuid";
import PermissionForm from "./PermissionForm";

export default function PermissionTable(props: { dataSource: PermissionsTableItem[] }) {

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Resource',
            dataIndex: 'resource',
            key: 'resource'
        },
        {
            title: 'Create',
            dataIndex: 'operations',
            key: 'create',
            render: (operations: OperationType[]) => (
                <Checkbox checked={operations.some(op => op.operation === "CREATE")}/>
            )
        },
        {
            title: 'Read',
            dataIndex: 'operations',
            key: 'read',
            render: (operations: OperationType[]) => (
                <Checkbox checked={operations.some(op => op.operation === "READ")}/>
            )
        },
        {
            title: 'Update',
            dataIndex: 'operations',
            key: 'update',
            render: (operations: OperationType[]) => (
                <Checkbox checked={operations.some(op => op.operation === "UPDATE")}/>
            )
        },
        {
            title: 'Delete',
            dataIndex: 'operations',
            key: 'delete',
            render: (operations: OperationType[]) => (
                <Checkbox checked={operations.some(op => op.operation === "DELETE")}/>
            )
        },

        {
            title: 'Action',
            dataIndex: '',
            render: (_: any, record: PermissionsTableItem) => (
                <PermissionForm initialData={{
                    userId: record.id,
                    resource: record.resource,
                    permissions: record.operations.map((i) => ({id: i.id.toString(), type: "existing"})),
                    existingPermissions: record.operations.map((i) => i.id.toString())
                }} isEdit={true} key={uuidv4()} />
            )
        }

    ];

    return <Table
        dataSource={props.dataSource}
        columns={columns}
        rowKey={(record) => record.id}
        bordered
        pagination={false}
    />
}