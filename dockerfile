# Sử dụng image cơ sở là Nginx để phục vụ các file tĩnh
FROM nginx:alpine

# Sao chép các file tĩnh từ thư mục build vào thư mục phục vụ của Nginx
COPY build /usr/share/nginx/html

# Cấu hình Nginx để phục vụ index.html cho mọi đường dẫn (hỗ trợ React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]