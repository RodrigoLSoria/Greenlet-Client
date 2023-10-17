import { useEffect } from 'react'
import './App.css'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import AppRoutes from './routes/AppRoutes'
import io from 'socket.io-client'

const socket = io('http://localhost:5005')



const App = () => {

  const receiveMessage = (messageData) => {
    setMessages(...messages, messageData)
  }

  useEffect(() => {
    socket.on('message', (data) => {
    })

    return () => {
      socket.off('message', receiveMessage)

    }

  }, [])

  return (
    <div className="App">
      <Navigation />

      <AppRoutes />

      <Footer />

    </div>
  )
}

export default App
