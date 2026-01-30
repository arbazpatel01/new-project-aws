# AWS Lightsail Demo App

A simple React + Node.js application with MySQL database, ready for deployment on AWS Lightsail.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### Database Setup

1. **Install MySQL** on your system (if not already installed)

2. **Configure database connection:**
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=contact_db
   DB_PORT=3306
   ```

3. The application will **automatically create** the database and tables on startup.

### Local Development

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```
   This runs both the React frontend (port 3000) and Node.js backend (port 5000).

### Production Build

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   NODE_ENV=production npm start
   ```

## 📁 Project Structure

```
AWS_Setup/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── App.css
│   │   ├── ContactForm.js # Contact form component
│   │   ├── ContactForm.css
│   │   ├── index.js
│   │   └── index.css      # Global styles
│   └── package.json
├── server/
│   ├── index.js           # Express server
│   └── db.js              # Database configuration
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment file
├── package.json           # Root package.json
└── README.md
```

## 🌐 API Endpoints

### General
- `GET /api/health` - Server health check (includes database status)
- `GET /api/info` - Application info

### Contact Form
- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "Your message here"
  }
  ```
- `GET /api/contacts` - Get all contacts (admin)
- `GET /api/contacts/:id` - Get single contact
- `PATCH /api/contacts/:id/read` - Mark as read
- `DELETE /api/contacts/:id` - Delete contact

## ☁️ AWS Lightsail Deployment

### Option 1: Using Node.js Instance

1. Create a Lightsail instance with Node.js blueprint
2. SSH into your instance
3. Install MySQL:
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```
4. Clone your repository
5. Create `.env` file with production database credentials
6. Run `npm run install-all`
7. Run `npm run build`
8. Set `NODE_ENV=production`
9. Run `npm start`
10. Use PM2 for process management:
    ```bash
    npm install -g pm2
    pm2 start server/index.js --name "aws-app"
    pm2 startup
    pm2 save
    ```

### Option 2: Using Docker Container

Create a Dockerfile and use Lightsail Container Service.

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL user | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | contact_db |
| `DB_PORT` | MySQL port | 3306 |

## 📝 License

MIT

