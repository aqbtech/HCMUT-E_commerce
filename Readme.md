# E-commerce Website

## Introduction
<p style="text-align: justify;">
Welcome to our E-commerce website project! This project is part of the "Programming Integration Project - Software technology(CO3103)" course undertaken by students of CSE-HCMUT. It is designed to provide a robust and scalable platform for online shopping, utilizing modern web technologies.
</p>

### Supervisor
**ThS. Trần Trương Tuấn Phát**

### Member
We are a group of enthusiastic students from the Computer Science and Engineering department at HCMUT. Our team members include:
|MSSV    | FullName               | Role |
|--------|------------------------|------|
|2212825 | Từ Văn Nguyễn Anh Quân | Project manager, Backend Developer, Software Architect
|2212801 | Nguyễn Minh Quân       | Backend Developer, Frontend Developer
|2212865 | Đoàn Ngọc Văn Quý      | Backend Developer, Frontend Developer
|2210387 | Đặng Trần Công Chính   | Business analyst, Quality Control, Frontend Developer

Together, we aim to leverage our diverse skills to create an innovative and user-friendly e-commerce platform.

## Technologies Used

### Backend
- **Spring Boot**: A powerful framework for building Java-based web applications. It simplifies the development process by providing a comprehensive set of tools and libraries.

### Frontend
- **React**: A popular JavaScript library for building user interfaces. React allows for the creation of dynamic and responsive web pages.

## Features

- **User Authentication**: Secure login and registration system using JWT (JSON Web Tokens).
- **Product Management**: Admin interface for adding, updating, and deleting products.
- **Shopping Cart**: Users can add products to their cart and proceed to checkout.
- **Order Management**: Track orders and manage order statuses.
- **Payment Integration**: Seamless payment processing using popular payment gateways.

## Project Structure

```
HCMUT_E-commerce/
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── ...
├── data_seed.sql
└── README.md
```

## Getting Started

### Prerequisites

- **Java 21**: Ensure you have JDK 21 installed.
- **Node.js**: Required for running the React development server.
- **MySQL**: The database used for storing application data.

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/aqbtech/HCMUT-E_commerce.git
   cd HCMUT_E-commerce/Backend
   ```

2. Configure the database and environment variable:
    - Create `.env` in `src/main/`.
    - Update the MySQL connection details, payment integration infomation, firebase service key and jwt signer key:
      ```
      SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3309/e-commerce
      SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
      SPRING_DATASOURCE_USERNAME=your-username
      SPRING_DATASOURCE_PASSWORD=your-password
      CORS_ALLOWED_ORIGINS=http://localhost:5173
      JWT_SIGNER_KEY=<a-jwt-key>
      FIREBASE_CONFIG_PATH=<path-to-your-file-service-firebase>
      ZALO_APP_ID=<your-app-id>
      ZALO_SECRET_KEY=<your-secret-key>
      ZALO_PUBLIC_KEY=<your-public-key>
      ZALO_ENDPOINT=<endpoint-of-zalo>
      ZALO_CALLBACK=<your-callback-url>
      ```

3. Build and run the backend:
   ```
   ./mvn clean package
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm run dev
   ```



## Contact

For any questions or suggestions, please contact the project maintainers at [tvnaquan@gmail.com](mailto:tvnaquan@gmail.com).
