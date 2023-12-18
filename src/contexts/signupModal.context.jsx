import { createContext, useState, useContext } from "react"

const SignupModalContext = createContext()

export const useSignupModalContext = () => {
    return useContext(SignupModalContext)
}

export const SignupModalProvider = ({ children }) => {
    const [showSignupModal, setShowSignupModal] = useState(false)

    return (
        <SignupModalContext.Provider value={{ showSignupModal, setShowSignupModal }}>
            {children}
        </SignupModalContext.Provider>
    )
}