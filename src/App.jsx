// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import './App.css';
import Category from './pages/Category';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/invoices" element={<Invoices />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;