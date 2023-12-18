import { createContext, useState, useContext } from "react"


const LoginModalContext = createContext()

export const useLoginModalContext = () => {
    return useContext(LoginModalContext)
}

export const LoginModalProvider = ({ children }) => {
    const [showLoginModal, setShowLoginModal] = useState(false)

    return (
        <LoginModalContext.Provider value={{ showLoginModal, setShowLoginModal }}>
            {children}
        </LoginModalContext.Provider>
    )
}

