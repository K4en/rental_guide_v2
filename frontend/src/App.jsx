import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {checkAuth} from "./services/api";

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PublicGuide from "./components/PublicGuide"

function App() {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(()=> {
        async function verify(){
            const ok = await checkAuth();
            setAuthenticated(ok);
            }
        verify();
    }, []);
    if (authenticated === null) {
                return <p>Loading...</p>;
    }
  return (
    <BrowserRouter>
        <Routes>

            <Route path="/" element={<Login setAuthenticated={setAuthenticated}/>} />
            <Route path="/register" element={<Register setAuthenticated={setAuthenticated} />} />
            <Route
                path="/dashboard"
                element={
                    authenticated
                        ? <Dashboard />
                        : <Navigate to="/" />
                }
            />
            <Route path="/guide/:propertyId" element={<PublicGuide />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App
