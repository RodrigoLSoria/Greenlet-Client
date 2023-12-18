import React, { createContext, useState, useContext } from 'react'

export const ExchangeStatusContext = createContext()

export const ExchangeStatusProvider = ({ children }) => {
    const [exchangeStatus, setExchangeStatus] = useState(null)

    const updateExchangeStatus = (status) => {
        setExchangeStatus(status)
    }

    return (
        <ExchangeStatusContext.Provider value={{ exchangeStatus, updateExchangeStatus }}>
            {children}
        </ExchangeStatusContext.Provider>
    )
}

export const useExchangeStatusContext = () => {
    return useContext(ExchangeStatusContext)
}