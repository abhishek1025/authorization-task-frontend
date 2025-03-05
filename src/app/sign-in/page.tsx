'use client';

import { AuthComponent } from '@/components/auth';
import {clientPostRequest, setCookie} from '@/utils';
import { useRouter } from 'next/navigation';
import {toast} from "sonner";

export default function SignIn() {
  const router = useRouter();

  type SignInType = {
    email: string;
    password: string;
  };

  async function handleSignIn(values: SignInType) {
      toast.promise(
          clientPostRequest({
              endpoint: '/auth/sign-in',
              data: values
          }),
          {
              loading: "Signing in...",
              success: (res) => {
                  const date = new Date();
                  date.setDate(date.getDate() + 7);

                  setCookie("token", res.data.token, date);
                  router.push('/');

                  return res.msg || "Sign In successful!";
              },
              error: (err) => err?.msg || "Sign In failed. Please try again."
          }
      );
  }

  return (
    <AuthComponent<SignInType>
      isSignIn
      handleSubmitAction={handleSignIn}
      initialValues={{
        email: '',
        password: '',
      }}></AuthComponent>
  );
}


