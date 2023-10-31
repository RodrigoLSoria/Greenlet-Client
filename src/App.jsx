import './App.css'
import Footer from './components/Footer/Footer'
import Navigation from './components/Navigation/Navigation'
import AppRoutes from './routes/AppRoutes'
import './animations.css'


const App = () => {

  return (
    <div className="App">
      <Navigation />

      <AppRoutes />

      <Footer />
    </div>
  )
}

export default App
