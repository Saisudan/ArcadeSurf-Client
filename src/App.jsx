import './App.scss';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocketTest from './components/SocketTest/SocketTest';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Header from './components/Header/Header';

export const UserContext = React.createContext(null);

function App() {
  const [ userInfo, setUserInfo ] = useState(null);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userInfo: userInfo, setUserInfo: setUserInfo }}>
          <Header/>
          <Routes>
            <Route path='/' element={<p>main page</p>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/temp' element={<SocketTest/>}/>
            <Route path='*' element={<p>nothing found</p>}/>
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;