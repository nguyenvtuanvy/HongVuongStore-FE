import React, { useState, useEffect } from 'react';
import { getAllContracts, getContractById, updateContract, getWeeklyRevenue, getMonthlyRevenue } from '../services/contractApi'; // Import hàm gọi API
import './Invoices.css'; // Import file CSS
import { Bar, Line } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip } from 'chart.js';

// Đăng ký các thành phần cần thiết
Chart.register(LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip);
const Invoices = () => {
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null); // Lưu hợp đồng được chọn
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]); // Dữ liệu doanh thu từng tháng trong năm
    const [weeklyRevenueData, setWeeklyRevenueData] = useState([]);

    // Gọi API để lấy danh sách hợp đồng khi component được render
    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const data = await getAllContracts();
                setContracts(data.sort((a, b) => a.id - b.id));
            } catch (error) {
                console.error('Lỗi khi lấy danh sách hợp đồng:', error);
            }
        };

        fetchContracts();
    }, []);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                // Lấy doanh thu từng tuần trong tháng hiện tại
                const weeklyRevenueResponse = await getWeeklyRevenue(currentMonth, currentYear);
                console.log("Doanh thu từng tuần trong tháng hiện tại:", weeklyRevenueResponse);

                // Chuyển đổi object thành mảng giá trị
                const weeklyRevenueValues = Object.values(weeklyRevenueResponse);
                setWeeklyRevenueData(weeklyRevenueValues);

                // Lấy doanh thu từng tháng trong năm hiện tại
                const monthlyRevenueResponse = await getMonthlyRevenue(currentYear);
                console.log("Doanh thu từng tháng trong năm hiện tại:", monthlyRevenueResponse);

                // Chuyển đổi object thành mảng giá trị
                const monthlyRevenueValues = Object.values(monthlyRevenueResponse);
                setMonthlyRevenueData(monthlyRevenueValues);
            } catch (error) {
                console.error('Lỗi khi lấy doanh thu:', error);
            }
        };

        fetchRevenue();
    }, []);

    // Hàm mở modal và lấy chi tiết hợp đồng
    const handleViewDetails = async (contractId) => {
        try {
            const contractDetails = await getContractById(contractId);
            setSelectedContract(contractDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết hợp đồng:', error);
        }
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContract(null);
    };

    const handleMarkAsPaid = async (contractId) => {
        try {
            const updatedContract = await updateContract(contractId); // Gọi API cập nhật
            if (updatedContract) {
                // Cập nhật lại danh sách hợp đồng
                const updatedContracts = contracts.map((contract) =>
                    contract.id === contractId ? updatedContract : contract
                );
                setContracts(updatedContracts);
                alert('Cập nhật trạng thái thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật hợp đồng:', error);
            alert('Có lỗi xảy ra khi cập nhật hợp đồng.');
        }
    };

    // Dữ liệu cho biểu đồ doanh thu từng tháng trong năm
    const monthlyRevenueChartData = {
        labels: Object.keys(monthlyRevenueData).map(month => `Tháng ${parseInt(month) + 1}`),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: Object.values(monthlyRevenueData),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const weeklyRevenueChartData = {
        labels: Object.keys(weeklyRevenueData).map(week => `Tuần ${parseInt(week) + 1}`),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: Object.values(weeklyRevenueData),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    // Options cho biểu đồ doanh thu từng tháng trong năm
    const monthlyRevenueChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatCurrency(value), // Định dạng giá trị trục y thành VNĐ
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw; // Lấy giá trị từ dữ liệu
                        return `Doanh thu: ${formatCurrency(value)}`; // Hiển thị số tiền khi hover
                    },
                },
            },
        },
    };

    // Options cho biểu đồ doanh thu từng tuần trong tháng
    const weeklyRevenueChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatCurrency(value), // Định dạng giá trị trục y thành VNĐ
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw; // Lấy giá trị từ dữ liệu
                        return `Doanh thu: ${formatCurrency(value)}`; // Hiển thị số tiền khi hover
                    },
                },
            },
        },
    };

    return (
        <div className="invoices-container">
            <h1>Hóa đơn thuê</h1>

            <div className="charts-container">
                {/* Biểu đồ doanh thu từng tháng trong năm */}
                <div className="chart-container">
                    <h2>Doanh thu từng tháng trong năm</h2>
                    <Bar data={monthlyRevenueChartData} options={monthlyRevenueChartOptions} />
                </div>

                {/* Biểu đồ doanh thu từng tuần trong tháng */}
                <div className="chart-container">
                    <h2>Doanh thu từng tuần trong tháng</h2>
                    <Line data={weeklyRevenueChartData} options={weeklyRevenueChartOptions} />
                </div>
            </div>


            {contracts.length > 0 ? (
                <table className="contracts-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên khách hàng</th>
                            <th>Số CCCD</th>
                            <th>Số điện thoại</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract) => (
                            <tr key={contract.id}>
                                <td>{contract.id}</td>
                                <td>{contract.nameCustomer}</td>
                                <td>{contract.customerCCNumber}</td>
                                <td>{contract.phoneNumberCustomer}</td>
                                <td>{contract.totalPrice} VND</td>
                                <td>
                                    <span
                                        className={
                                            contract.status === 0
                                                ? 'status-paid'
                                                : contract.status === 1
                                                    ? 'status-renting'
                                                    : 'status-late'
                                        }
                                    >
                                        {contract.status === 0
                                            ? 'Đã trả'
                                            : contract.status === 1
                                                ? 'Đang thuê'
                                                : 'Chậm trả'}
                                    </span>
                                </td>
                                <td>{contract.note}</td>
                                <td>{contract.createdDate}</td>
                                <td>
                                    <button
                                        className="view-details-button"
                                        onClick={() => handleViewDetails(contract.id)}
                                    >
                                        Xem chi tiết
                                    </button>
                                    <button
                                        className={`mark-as-paid-button ${contract.status === 0 ? 'disabled-button' : ''}`}
                                        onClick={() => handleMarkAsPaid(contract.id)}
                                        disabled={contract.status === 0}
                                    >
                                        Đã trả
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Không có hợp đồng nào.</p>
            )}

            {/* Modal hiển thị chi tiết hợp đồng */}
            {isModalOpen && selectedContract && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Chi tiết hợp đồng</h2>
                        <div className="contract-details">
                            <p><strong>ID:</strong> {selectedContract.id}</p>
                            <p><strong>Tên khách hàng:</strong> {selectedContract.nameCustomer}</p>
                            <p><strong>Số CCCD:</strong> {selectedContract.customerCCNumber}</p>
                            <p><strong>Số điện thoại:</strong> {selectedContract.phoneNumberCustomer}</p>
                            <p><strong>Tổng tiền:</strong> {selectedContract.totalPrice} VND</p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span
                                    className={
                                        selectedContract.status === 0
                                            ? 'status-paid'
                                            : selectedContract.status === 1
                                                ? 'status-renting'
                                                : 'status-late'
                                    }
                                >
                                    {selectedContract.status === 0
                                        ? 'Đã trả'
                                        : selectedContract.status === 1
                                            ? 'Đang thuê'
                                            : 'Chậm trả'}
                                </span>
                            </p>
                            <p><strong>Ghi chú:</strong> {selectedContract.note}</p>
                            <p><strong>Ngày tạo:</strong> {selectedContract.createdDate}</p>
                        </div>

                        <h3>Danh sách sản phẩm</h3>
                        <div className="products-list">
                            {selectedContract.products.map((product) => (
                                <div key={product.id} className="product-item">
                                    <p><strong>Tên sản phẩm:</strong> {product.name}</p>
                                    <p><strong>Giá:</strong> {product.price} VND</p>
                                    <p><strong>Hình ảnh:</strong></p>
                                    <img src={product.image} alt={product.name} className="product-image" />
                                </div>
                            ))}
                        </div>

                        <button className="close-modal-button" onClick={handleCloseModal}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;