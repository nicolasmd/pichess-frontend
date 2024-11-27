import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from "./components/Dashboard";
import Play from "./components/Play";
/*import 'mdb-react-ui-kit/dist/css/mdb.dark.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";*/
import { MDBContainer } from 'mdb-react-ui-kit';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/signup" element={ <SignupPage/>} />
          <Route path = "/dashboard" element={<Dashboard/>}/>
          <Route path = "/play" element={<Play/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;