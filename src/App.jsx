import Home from './Home'
import LoginScreen from './Login'
import Dashboard from './dashboard'
import { Routes, Route, HashRouter } from 'react-router-dom'

function App () {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </HashRouter>
  )
}

export default App
