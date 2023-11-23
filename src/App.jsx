import './App.scss';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocketTest from './components/SocketTest/SocketTest';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound';
import AllLobbiesPage from './pages/AllLobbiesPage/AllLobbiesPage';
import LobbyPage from './pages/LobbyPage/LobbyPage';

export const UserContext = React.createContext(null);

function App() {
  const [ userInfo, setUserInfo ] = useState(null);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userInfo: userInfo, setUserInfo: setUserInfo }}>
          <Header/>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/lobby' element={<AllLobbiesPage/>}/>
            <Route path='/lobby/:id' element={<LobbyPage/>}/>
            <Route path='/temp' element={<SocketTest/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
          <Footer/>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;