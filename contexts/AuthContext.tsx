"use client";

import { redirect, usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const token = localStorage.getItem('token') as string;

                return JSON.parse(token);
            } catch (error) {
                return null;
            }
        }

        return null;
    });
    const [user, setUser] = useState<object | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const user = localStorage.getItem('user') as string;

                return JSON.parse(user);
            } catch (error) {
                return null;
            }
        }

        return null;
    });

    const pathname = usePathname();

    useEffect(() => {

        if (pathname !== '/' && (!token || !user)) {
            setToken(null);
            setUser(null);

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            redirect('/');
        }

    }, [token, user, pathname]);

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}