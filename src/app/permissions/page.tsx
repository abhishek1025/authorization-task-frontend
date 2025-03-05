import {fetchAllPermissions} from "@/actions/permission";
import {PermissionTable} from "@/components/permission";
import PermissionForm from "../../components/permission/PermissionForm";

export default async function PermissionsPage() {

    const permissions = await fetchAllPermissions();


    return (
        <div className='space-y-4 p-12'>

            <div className="flex justify-between items-center">
                <h1 className='text-2xl text-center'>Permissions Page</h1>

                <PermissionForm isEdit={false} initialData={{
                    permissions: [],
                    userId: "",
                    resource: "",
                    existingPermissions: []
                }}/>
            </div>

            <PermissionTable dataSource={permissions}/>

        </div>
    )
}