import React, { useState, useEffect } from 'react';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../services/categoryApi';
import './Category.css';

const Category = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    // Lấy danh sách danh mục khi component được render
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories();

            // Sắp xếp danh sách theo id từ bé đến lớn
            const sortedCategories = data.sort((a, b) => a.id - b.id);

            setCategories(sortedCategories); // Cập nhật state categories
        };
        fetchCategories();
    }, []);

    // Xử lý thêm danh mục mới
    const handleAddCategory = async () => {
        if (!categoryName) {
            setMessage('Vui lòng nhập tên danh mục');
            return;
        }

        const category = { name: categoryName };
        const result = await createCategory(category);

        if (result) {
            setMessage('Danh mục đã được thêm thành công!');
            setCategoryName(''); // Reset trường nhập liệu

            // Lấy lại danh sách danh mục mới nhất từ API
            const updatedCategories = await getAllCategories();

            // Sắp xếp danh sách theo id từ bé đến lớn
            const sortedCategories = updatedCategories.sort((a, b) => a.id - b.id);

            setCategories(sortedCategories); // Cập nhật state categories
        } else {
            setMessage('Có lỗi xảy ra khi thêm danh mục');
        }
    };

    // Xử lý cập nhật danh mục
    const handleUpdateCategory = async () => {
        if (!categoryName) {
            setMessage('Vui lòng nhập tên danh mục');
            return;
        }

        const category = { name: categoryName };
        const result = await updateCategory(editingCategory.id, category);

        if (result) {
            setMessage('Danh mục đã được cập nhật thành công!');
            setCategoryName(''); // Reset trường nhập liệu
            setEditingCategory(null); // Đóng chế độ chỉnh sửa

            // Lấy lại danh sách danh mục mới nhất từ API
            const updatedCategories = await getAllCategories();

            // Sắp xếp danh sách theo id từ bé đến lớn
            const sortedCategories = updatedCategories.sort((a, b) => a.id - b.id);

            setCategories(sortedCategories); // Cập nhật state categories
        } else {
            setMessage('Có lỗi xảy ra khi cập nhật danh mục');
        }
    };

    // Xử lý xóa danh mục
    const handleDeleteCategory = async (id) => {
        const result = await deleteCategory(id);

        if (result) {
            setMessage('Danh mục đã được xóa thành công!');

            // Lấy lại danh sách danh mục mới nhất từ API
            const updatedCategories = await getAllCategories();

            // Sắp xếp danh sách theo id từ bé đến lớn
            const sortedCategories = updatedCategories.sort((a, b) => a.id - b.id);

            setCategories(sortedCategories); // Cập nhật state categories
        } else {
            setMessage('Có lỗi xảy ra khi xóa danh mục');
        }
    };

    // Bắt đầu chỉnh sửa danh mục
    const startEditing = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
    };

    return (
        <div className="category-container">
            <h1>Danh Mục</h1>
            <div className="category-form">
                <h2>{editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h2>
                <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                {editingCategory ? (
                    <button onClick={handleUpdateCategory}>Cập nhật</button>
                ) : (
                    <button onClick={handleAddCategory}>Thêm danh mục</button>
                )}
            </div>
            {message && <p className="message">{message}</p>}
            <div className="category-list">
                <h2>Danh sách danh mục</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button onClick={() => startEditing(category)}>Sửa</button>
                                    <button onClick={() => handleDeleteCategory(category.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Category;