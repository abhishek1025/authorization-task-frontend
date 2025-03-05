'use client'

import {AuthComponent} from '@/components/auth/';
import {clientPostRequest} from "@/utils";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function SignUp() {
    type SignUpType = {
        email: string,
        password: string,
        name: string,
    }

    const router = useRouter();

    async function handleSignUp(values: SignUpType) {
        toast.promise(
            clientPostRequest({
                endpoint: '/auth/sign-up',
                data: values
            }),
            {
                loading: "Signing up...",
                success: (res) => {
                    router.push("/sign-in");
                    return res.msg || "Sign up successful!";
                },
                error: (err) => err?.msg || "Sign up failed. Please try again."
            }
        );
    }


    return <AuthComponent<SignUpType> isSignIn={false} handleSubmitAction={handleSignUp} initialValues={{
        email: '',
        password: '',
        name: '',
    }}/>;
}

