# Sử dụng hình ảnh cơ sở OpenJDK chính thức hỗ trợ Java 21
FROM eclipse-temurin:21-jdk-alpine

# Đặt biến môi trường để tránh các lỗi liên quan đến vùng giờ
ENV TZ=Asia/Ho_Chi_Minh \
    LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép tệp JAR đã build từ máy cục bộ vào container
COPY target/*.jar app.jar

# Mở cổng mặc định của ứng dụng Spring Boot (thường là 8080)
EXPOSE 8080

# Câu lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
