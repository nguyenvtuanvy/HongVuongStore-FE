import axios from 'axios';

const API_URL = 'https://hongvuong-store-latest.onrender.com/api/v1/products'; // Địa chỉ API của Spring Boot

// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategoryId = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/product/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
};

// Tạo sản phẩm mới
export const createProduct = async (productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('image', productData.image);

    try {
        const response = await axios.post(`${API_URL}/save`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

// Xoá sản phẩm
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${productId}`);
        console.log(response.data);
        return response.data; // Trả về thông báo từ server
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (productData) => {
    const formData = new FormData();
    formData.append('id', productData.id);
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('categoryId', productData.categoryId);
    formData.append('image', productData.image);

    try {
        const response = await axios.put(`${API_URL}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Trả về thông báo từ server
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};