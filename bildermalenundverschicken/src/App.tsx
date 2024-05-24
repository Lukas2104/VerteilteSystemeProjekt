import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContainer } from './pages/UserContainer';
import { Home } from './pages/Home';
import './styles/mainStyles.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/chat" element={<UserContainer />}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;