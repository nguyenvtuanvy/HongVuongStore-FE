// src/services/categoryApi.js
import axios from 'axios';

const API_URL = 'https://hongvuong-store-latest.onrender.com/api/v1/categories';

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const createCategory = async (category) => {
    try {
        const response = await axios.post(`${API_URL}/save`, category);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
};

export const updateCategory = async (id, category) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, category);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};