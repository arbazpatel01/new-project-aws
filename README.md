# AWS Lightsail Demo App

A simple React + Node.js application ready for deployment on AWS Lightsail.

## 🚀 Quick Start

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
│   │   ├── index.js
│   │   └── index.css      # Global styles
│   └── package.json
├── server/
│   └── index.js           # Express server
├── package.json           # Root package.json
└── README.md
```

## 🌐 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/info` - Application info

## ☁️ AWS Lightsail Deployment

### Option 1: Using Node.js Instance

1. Create a Lightsail instance with Node.js blueprint
2. SSH into your instance
3. Clone your repository
4. Run `npm run install-all`
5. Run `npm run build`
6. Set `NODE_ENV=production`
7. Run `npm start`
8. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "aws-app"
   pm2 startup
   pm2 save
   ```

### Option 2: Using Docker Container

Create a Dockerfile and use Lightsail Container Service.

## 🔧 Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 📝 License

MIT
