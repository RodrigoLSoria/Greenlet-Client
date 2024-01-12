import React, { createContext, useContext, useState } from 'react'

const ConfettiContext = createContext()

export const useConfetti = () => useContext(ConfettiContext)

export const ConfettiProvider = ({ children }) => {
    const [showConfetti, setShowConfetti] = useState(false)

    return (
        <ConfettiContext.Provider value={{ showConfetti, setShowConfetti }}>
            {children}
        </ConfettiContext.Provider>
    )
}
