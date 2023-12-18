import { createContext, useContext, useState } from 'react'

const MessageModalContext = createContext()

export const useMessageModalContext = () => {
    return useContext(MessageModalContext)
}

export const MessageModalProvider = ({ children }) => {
    const [showMessageModal, setShowMessageModal] = useState(false)

    return (
        <MessageModalContext.Provider value={{ showMessageModal, setShowMessageModal }}>
            {children}
        </MessageModalContext.Provider>
    )
}
