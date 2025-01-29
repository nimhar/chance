import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateLottery from './pages/CreateLottery'
import ViewLottery from './pages/ViewLottery'
import SingleTaskLottery from './pages/SingleTaskLottery'
import Header from './components/Header'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateLottery />} />
          <Route path="/lottery/:id" element={<ViewLottery />} />
          <Route path="/single-lottery/:id" element={<SingleTaskLottery />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
