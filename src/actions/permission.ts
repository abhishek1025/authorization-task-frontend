import {serverGetRequest} from "@/utils";
import {PermissionsTableItem} from "@/interface";

export async function fetchAllPermissions(): Promise<PermissionsTableItem[]> {

    const response = await serverGetRequest({
        endpoint: '/permissions',
    })

    return response.data;
}