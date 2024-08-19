import {BrowserRouter ,Routes,Route,Navigate} from 'react-router-dom';
import './App.css';
import Sorting from './pages/Sorting';
import Pathfinding from './pages/Pathfinding';

function App() {
  
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/sorting' element={<Sorting></Sorting>}></Route>
        <Route path='/pathfinding' element={<Pathfinding></Pathfinding>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
