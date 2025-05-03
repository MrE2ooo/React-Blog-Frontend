import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    async function getUser() {
        try {
            const res = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                // Token is invalid or expired
                console.error("Invalid token, logging out...");
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user ,setUser}}>
            {children}
        </AppContext.Provider>
    );
}