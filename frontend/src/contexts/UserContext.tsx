import { FC, ReactNode, Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface User {
    username?: string,
    isAdmin?: boolean
}

interface UserContextValue {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>
}

const UserContext = createContext<UserContextValue | null>(null)

export const UserContextProvider: FC<{children: ReactNode|ReactNode[]}> = ({children}) => {

    const [user, setUser] = useState<User | null>(null)

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>{children}</UserContext.Provider>
    )
}

export const useUser = () => {
    const userContext = useContext(UserContext)
    if (!userContext) {
        throw new Error("useUser must be used within <UserContextProvider>")
    }
}