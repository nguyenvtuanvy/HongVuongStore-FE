import axios from 'axios';

const API_URL = 'https://hongvuong-store-latest.onrender.com/api/v1/contracts';

// Lưu hợp đồng (POST)
export const saveContract = async (contractData) => {
    try {
        const response = await axios.post(`${API_URL}/save`, contractData);
        console.log(response.data); // Trả về hợp đồng đã lưu
        return response.data;
    } catch (error) {
        console.error('Error saving contract:', error);
        return null;
    }
};

// Cập nhật hợp đồng (PUT)
export const updateContract = async (contractId) => {
    try {
        const response = await axios.put(`${API_URL}/update/${contractId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating contract:', error);
        return null;
    }
};

// Tìm hợp đồng theo ID (GET)
export const getContractById = async (contractId) => {
    try {
        const response = await axios.get(`${API_URL}/${contractId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching contract with ID ${contractId}:`, error);
        return null;
    }
};

// Lấy tất cả các hợp đồng (GET)
export const getAllContracts = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all contracts:', error);
        return [];
    }
};

export const getWeeklyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/revenue/weekly`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly revenue:', error);
        return 0;
    }
};

export const getMonthlyRevenue = async () => {
    try {
        const response = await axios.get(`${API_URL}/revenue/monthly`);
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        return 0;
    }
};