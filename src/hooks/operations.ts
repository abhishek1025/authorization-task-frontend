import {useEffect, useState} from "react";
import {OperationType} from "@/interface";
import {clientGetRequest} from "@/utils";

export const useFetchAllOperations = () => {

    const [operations, setOperations] = useState<OperationType[]>([]);

    const fetchOperations = async () => {

        const response = await clientGetRequest({
            endpoint: '/operations',
        });

        if (response.ok) {
            setOperations(response.data);
            return;
        }
    }

    useEffect(() => {
        fetchOperations();
    }, [])

    return {operations};

}