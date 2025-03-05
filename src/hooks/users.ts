import {useEffect, useState} from "react";
import {UserType} from "@/interface";
import {clientGetRequest} from "@/utils";

export const useFetchAllUsers = () => {

    const [users, setUsers] = useState<UserType[]>([]);

    const fetchUsers = async () => {

        const response = await clientGetRequest({
            endpoint: '/users',
        });

        if (response.ok) {
            setUsers(response.data);
            return;
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return {users}
}