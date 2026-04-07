import Todo from './Todo'
import SignUp from './SignUp'
import Login from './Login'
import Home from './Home';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './style.css'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap Bundle JS (includes Popper.js for dropdowns/modals)
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  
  return (
       <Router>
        <Navbar/>
        <Routes>
           <Route exact path='/' element={<Home/>}/>
           <Route path='/signup' element={<SignUp/>}/>
           <Route path='/login' element={<Login/>}/>
           <Route path='/todo' element={<Todo/>}/>
        </Routes>
       </Router>
  )}
export default App;
