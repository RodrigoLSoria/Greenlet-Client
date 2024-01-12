import './App.css'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import AppRoutes from './routes/AppRoutes'
import './animations.css'
import Confetti from 'react-confetti'
import { useConfetti } from './contexts/confetti.context'

const App = () => {
  const { showConfetti } = useConfetti()

  return (
    <>
      {showConfetti && (
        <div className="confetti">
          <Confetti />
        </div>)}
      <div className="App">
        <Navigation />

        <AppRoutes />

        <Footer />
      </div>
    </>
  )
}

export default App
