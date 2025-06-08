import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import './App.css'
import Home from './pages/Home';
import Layout from './components/Layout.jsx';

function App(){
  
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
      <Layout isAuthenticated={isAuthenticated}>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </Router>
    </Layout>
  );
};

export default App
