import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<p>main page</p>}/>
          <Route path='*' element={<p>nothing found</p>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
