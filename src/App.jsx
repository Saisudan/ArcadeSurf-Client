import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocketTest from './components/SocketTest/SocketTest';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Header/> */}
        <Routes>
          <Route path='/' element={<SocketTest/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/temp' element={<SocketTest/>}/>
          <Route path='*' element={<p>nothing found</p>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
