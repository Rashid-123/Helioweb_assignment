# Helioweb

## Installation
### **1. Clone the repository**
```sh
 git clone https://github.com/Rashid-123/Helioweb_assignment.git
 cd Helioweb
```

### **2. Install dependencies**
#### **Backend**
```sh
cd server
npm install
```
#### **Frontend**
```sh
cd client
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the `server` directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:3000
```
Create a `.env` file in the `client` directory and add:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### **4. Start the application**
#### **Backend**
```sh
cd server
npm start
```
#### **Frontend**
```sh
cd client
npm start
```

## API Endpoints
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| POST   | /start    | Start a new game |




## Deployment
- **Frontend**: Vercel
- **Backend**: render.com


