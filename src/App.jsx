import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocketTest from './components/SocketTest/SocketTest';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Header/> */}
        <Routes>
          <Route path='/' element={<SocketTest/>}/>
          <Route path='*' element={<p>nothing found</p>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
