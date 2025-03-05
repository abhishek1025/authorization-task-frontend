"use client"

import Link from "next/link";
import {Button} from "antd";
import Logo from "@/components/Logo";
import {JSX} from "react";
import {getAuthTokenFromCookie, removeTokenFromCookie} from "@/utils";
import {usePathname, useRouter} from "next/navigation";


export default function NavBarAndFooter({children}:{children: JSX.Element}) {
    const pathname = usePathname();
    const router = useRouter();

    const token = getAuthTokenFromCookie();

    if(['/sign-in', '/sign-up'].includes(pathname)) return children;

    return <>

        <div className="border-b border-1 border-gray-300 px-4 py-6 flex justify-between items-center">

            <Logo/>

            {
                token ?
                    <div className="flex gap-x-4 items-center">
                        <div>
                            <Link href='/permissions'>
                                <Button>Permissions</Button>
                            </Link>

                        </div>

                        <div>
                            <Button type="primary" onClick={() => {
                                removeTokenFromCookie();
                                router.push('/sign-in');
                            }}>Log Out</Button>
                        </div>

                    </div>
                    :
                    <div>
                        <div>
                            <Link href='/sign-in'>
                                <Button>Sign In</Button>
                            </Link>
                        </div>

                        <div>
                            <Link href='/sign-up'>
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    </div>
            }
        </div>

        {children}

        <div className="p-4 bg-gray-100 text-center">
            <p>© 2025 Company Name All rights reserved.</p>
        </div>


    </>
}