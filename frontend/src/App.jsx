import Whiteboard from "./Components/WhiteBoard";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import CreateRoom from "./Components/CreateRoom";
// import Login from "./Components/Login";


import './index.css'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/createroom' element={ <CreateRoom/>}/>
    <Route path="/room/:roomId"  element={<Whiteboard/>}/>
    {/* <Route path="/login" element={<Login/>}/> */}
    </Routes>
      </BrowserRouter>

  );
}

export default App;
