// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/category">Danh Mục</a></li>
                <li><a href="/products">Sản phẩm</a></li>
                <li><a href="/invoices">Hóa đơn thuê</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;