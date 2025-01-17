import  Home  from './pages/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';


function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/"></Route>
        <Route element={<Login />} path="/login"></Route>
        <Route element={<Register />} path="/register"></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
