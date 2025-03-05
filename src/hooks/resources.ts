import {useEffect, useState} from "react";
import {clientGetRequest} from "@/utils";

export const useFetchAllResources = () => {
    const [resources, setResources] = useState<string[]>([]);

    const fetchResources = async () => {

        const response = await clientGetRequest({
            endpoint: '/resources',
        });

        if (response.ok) {
            setResources(response.data);
            return;
        }
    }

    useEffect(() => {
        fetchResources()
    }, [])

    return {resources}
}