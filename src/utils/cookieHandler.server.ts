"use server"

import { cookies } from 'next/headers';


export const getTokenFromCookieServer = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value || ''
}
