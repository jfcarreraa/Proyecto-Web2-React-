import React, { useState, useEffect} from 'react';
import AuthRoutes from './components/login/AuthRoutes';
import { ToastContainer } from "react-toastify";
import './App.css';
import AppRouter from './AppRouter';

export const UserContext = React.createContext();

function App() {
  const [logged, setLogged] = useState(false);
  
  useEffect(()=>{
    const UserLogged = localStorage.getItem("isLogged"); 
    if (UserLogged === "true") { 
      setLogged(true);
    }
  },[])
  return (
    <div className="App">
      <UserContext.Provider value={setLogged}>
      {logged ? (
          <AppRouter />
        ) : (
          <AuthRoutes />
        )}
      </UserContext.Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
