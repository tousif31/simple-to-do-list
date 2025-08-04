# SignPage - User Authentication & Todo Management System

A full-stack web application featuring user authentication, registration, and todo management capabilities. Built with React frontend and Node.js backend with MySQL database.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **JWT Token Management**: Stateless authentication using JSON Web Tokens
- **Password Security**: Bcrypt hashing for secure password storage
- **Todo Management**: Create, read, update, and delete todos
- **User-specific Todos**: Each user can manage their own todo list
- **Responsive Design**: Modern UI built with React and Bootstrap
- **Database Integration**: MySQL database with automatic table creation

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.7.1** - Client-side routing
- **Bootstrap 5.3.7** - CSS framework for responsive design
- **Axios 1.11.0** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MySQL2 3.14.3** - MySQL database driver
- **bcrypt 6.0.0** - Password hashing library
- **jsonwebtoken 9.0.2** - JWT implementation
- **cors 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.1** - Environment variable management

### Database
- **MySQL** - Relational database management system

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd signpage
```

### 2. Database Setup

1. Start your MySQL server
2. Create a MySQL database (optional - the app will create it automatically)
3. Update database credentials in `backend/server.js`:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'your_username',
     password: 'your_password',
     database: 'wipro_talent'
   });
   ```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-secret-key-here
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The React app will open in your browser at `http://localhost:3000`

## 📁 Project Structure

```
signpage/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Home.js
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /verify` - Verify JWT token

### Todos
- `GET /todos` - Get user's todos
- `POST /todos` - Create new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Bootstrap Styling**: Modern and clean interface
- **User-friendly Forms**: Intuitive login and registration forms
- **Todo Management**: Easy-to-use todo creation and management

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure MySQL database connection
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ for user authentication and todo management.

---

**Note**: Make sure to update the database credentials and JWT secret in the backend configuration before running the application. 
