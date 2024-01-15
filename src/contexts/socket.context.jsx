import { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client'

export const SocketContext = createContext()

const SOCKET_SERVER_URL = 'https://server-greenlet.fly.dev'

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL)
        setSocket(newSocket)

        newSocket.on('message', receiveMessage)

        return () => newSocket.off('message', receiveMessage)
    }, [])

    const receiveMessage = (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData])
    }

    return (
        <SocketContext.Provider value={{ socket, messages, setMessages }}>
            {children}
        </SocketContext.Provider>
    )
}

