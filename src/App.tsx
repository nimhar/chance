import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateLottery from './pages/CreateLottery'
import ViewLottery from './pages/ViewLottery'
import SingleTaskLottery from './pages/SingleTaskLottery'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <ChakraProvider>
      <Router basename="/chance">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreateLottery />} />
          <Route path="/lottery/:id" element={<ViewLottery />} />
          <Route path="/single-lottery/:id" element={<SingleTaskLottery />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
