// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import {
    getAllProducts,
    getProductsByCategoryId,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../services/productApi';
import { saveContract } from '../services/contractApi';
import axios from 'axios';
import './Product.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState('');
    const [message, setMessage] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [rentCart, setRentCart] = useState([]);
    const [renterName, setRenterName] = useState("");
    const [customerCCNumber, setCustomerCCNumber] = useState("");
    const [phoneNumberCustomer, setPhoneNumberCustomer] = useState("");
    const [note, setNote] = useState("");

    // Fetch and sort products by ID
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products/all');
                setProducts(response.data.sort((a, b) => a.id - b.id));
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/categories/all');
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    // Clear input fields and reset editing state
    const resetForm = () => {
        setProductName('');
        setProductPrice('');
        setSelectedCategoryId('');
        setProductImage('');
        setEditingProduct(null);
        setMessage('');
    };

    // Handle adding or updating a product
    const handleSubmit = async () => {
        if (!productName || !selectedCategoryId || !productImage) {
            setMessage('Vui lòng nhập đầy đủ thông tin sản phẩm.');
            return;
        }

        const productData = {
            name: productName,
            price: parseFloat(productPrice),
            categoryId: selectedCategoryId,
            image: productImage,
        };

        try {
            if (editingProduct) {
                productData.id = editingProduct.id;
                await updateProduct(productData);
                setMessage('Sản phẩm đã được cập nhật thành công!');
            } else {
                await createProduct(productData);
                setMessage('Sản phẩm đã được thêm thành công!');
            }

            const updatedProducts = await getAllProducts();
            setProducts(updatedProducts.sort((a, b) => a.id - b.id));
            resetForm();
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật sản phẩm:', error);
            setMessage('Có lỗi xảy ra khi thêm hoặc cập nhật sản phẩm.');
        }
    };

    // Handle product deletion
    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            setMessage('Sản phẩm đã được xoá thành công!');
            // setProducts(products.filter((product) => product.id !== productId));
        } catch (error) {
            console.error('Lỗi khi xoá sản phẩm:', error);
            setMessage('Có lỗi xảy ra khi xoá sản phẩm.');
        }
    };

    const handleAddToRentCart = (product) => {
        if (rentCart.find((item) => item.id === product.id)) {
            setMessage('Sản phẩm đã có trong danh sách thuê.');
            return;
        }
        setRentCart([...rentCart, product]);
        setMessage('Đã thêm sản phẩm vào danh sách thuê.');
    };

    const handleRemoveFromRentCart = (productId) => {
        setRentCart(rentCart.filter((item) => item.id !== productId));
        setMessage('Đã xóa sản phẩm khỏi danh sách thuê.');
    };

    // Handle selecting a product for editing
    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductPrice(product.price.toString());
        setSelectedCategoryId(product.category.id);
        setProductImage(product.image);
    };

    // Handle searching products by category
    const handleSearchByCategory = async () => {
        if (!selectedCategoryId) {
            setMessage('Vui lòng chọn danh mục.');
            return;
        }

        try {
            const filteredProducts = await getProductsByCategoryId(selectedCategoryId);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm theo danh mục:', error);
        }
    };

    // Handle renting a product
    const handleRent = (product) => {
        handleAddToRentCart(product);
    };

    // Handle rent form submission
    const handleRentSubmit = async () => {
        if (!renterName || !customerCCNumber || !phoneNumberCustomer) {
            alert('Vui lòng nhập đầy đủ thông tin thuê.');
            return;
        }

        const totalPrice = rentCart.reduce((total, item) => total + item.price, 0);

        const contractData = {
            contract: {  // Đối tượng contract chứa các thông tin cần thiết
                nameCustomer: renterName,
                customerCCNumber: customerCCNumber,
                phoneNumberCustomer: phoneNumberCustomer,
                totalPrice: totalPrice,
                note: note,
            },
            productIds: rentCart.map(product => product.id)  // Danh sách ID sản phẩm
        };

        try {
            const savedContract = await saveContract(contractData);

            if (savedContract) {
                alert('Hợp đồng đã được lưu thành công!');
                resetRentForm();
            } else {
                alert('Có lỗi xảy ra khi lưu hợp đồng.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo hồ sơ thuê:', error);
            alert('Có lỗi xảy ra khi tạo hồ sơ thuê.');
        }
    };

    // Reset rent form
    const resetRentForm = () => {
        setRentCart([]);
        setRenterName('');
        setCustomerCCNumber('');
        setPhoneNumberCustomer('');
        setNote('');
        setMessage('');
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    return (
        <div className="products-container">
            <h1>Sản phẩm</h1>

            <div className="product-form">
                <h2>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Giá sản phẩm"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Đường dẫn hình ảnh"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                />
                <button onClick={handleSubmit}>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
            </div>

            {message && <p className="message">{message}</p>}

            <div className="product-search">
                <h2>Tìm kiếm sản phẩm theo danh mục</h2>
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleSearchByCategory}>Tìm kiếm</button>
            </div>

            <div className="product-list">
                <h2>Danh sách sản phẩm</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Ảnh</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5">Không có sản phẩm</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{formatPrice(product.price)} VND</td>
                                    <td>
                                        {product.image && <img src={product.image} alt={product.name} width="120" />}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(product)} className="edit-button">
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="delete-button">
                                                Xoá
                                            </button>
                                            <button onClick={() => handleRent(product)} className="rent-button">
                                                Thuê
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {rentCart.length > 0 ? (
                <div className="rent-cart">
                    <h2>Danh sách thuê</h2>
                    <ul>
                        {rentCart.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.price} VND{' '}
                                <button onClick={() => handleRemoveFromRentCart(item.id)}>Xóa</button>
                            </li>
                        ))}
                    </ul>

                    {/* Hiển thị tổng tiền */}
                    <div className="total-price">
                        <strong>Tổng tiền: {rentCart.reduce((total, item) => total + item.price, 0)} VND</strong>
                    </div>

                    <div className="rent-form">
                        <h2>Xác nhận thông tin thuê</h2>
                        <input
                            type="text"
                            placeholder="Tên người thuê"
                            value={renterName}
                            onChange={(e) => setRenterName(e.target.value)}
                            className="rent-input"
                        />
                        <input
                            type="text"
                            placeholder="Số CCCD của khách hàng"
                            value={customerCCNumber}
                            onChange={(e) => setCustomerCCNumber(e.target.value)}
                            className="rent-input"
                        />
                        <input
                            type="text"
                            placeholder="Số điện thoại khách hàng"
                            value={phoneNumberCustomer}
                            onChange={(e) => setPhoneNumberCustomer(e.target.value)}
                            className="rent-input"
                        />
                        <textarea
                            placeholder="Ghi chú"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="rent-note"
                        />
                        <button onClick={handleRentSubmit} className="rent-submit-button">
                            Xác nhận thuê
                        </button>
                    </div>
                </div>
            ) : (
                <p className="no-rent-items">Chưa có sản phẩm nào trong danh sách thuê.</p>
            )}
        </div>
    );
};

export default Products;