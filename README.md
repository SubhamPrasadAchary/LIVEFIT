# 🏋️ LIVEFIT - Smart Nutrition Tracker 
 
![LIVEFIT Banner](https://img.shields.io/badge/LIVEFIT-Nutrition%20Tracker-green) 
![License](https://img.shields.io/badge/license-MIT-blue) 
![Version](https://img.shields.io/badge/version-1.0.0-orange)  

<img width="1718" height="888" alt="Screenshot 2026-01-17 221514" src="https://github.com/user-attachments/assets/4e01f590-2eae-46cf-8e2b-5e11ec163f2b" />
  
## 📖 About 

LIVEFIT isn’t just another fitness app — it’s your AI-powered wellness partner built to make healthy living effortless, smart, and motivating! 🌱🚀

With LIVEFIT, you can easily log meals 🍛 by dish and quantity or simply upload a photo 📸, and within seconds, our intelligent system analyzes your food, calculates calories 🔥, and provides a detailed nutrient breakdown 🧠. It’s fast, accurate, and made for everyday use!

💡 What makes LIVEFIT special is its ability to go beyond tracking — it delivers AI insights 🤖, daily progress reports 📊, and personalized goals 🎯 that evolve with your habits. Whether you’re trying to lose weight, gain strength, or just live healthier, LIVEFIT keeps you consistent and inspired every step of the way! 🌟

Behind the scenes, LIVEFIT is powered by modern full-stack technologies ⚙️ and machine learning intelligence 🧩, ensuring smooth performance, responsive design, and a truly engaging experience across all devices. 📱💻

LIVEFIT isn’t just an app — it’s your digital fitness coach, your nutrition buddy, and your daily motivation to build a stronger, healthier, and more confident you. 💥🔥

Eat smart. Stay fit. Live better. — LIVEFIT ❤️

## ✨ Features 

- 📸 **Image-based Food Recognition**: Upload food photos for instant calorie calculation
- 🍽️ **Manual Food Logging**: Log meals by dish name and quantity
- 🤖 **AI-Powered Insights**: Get personalized nutrition recommendations
- 📊 **Daily Tracking**: Monitor your calorie intake and nutritional goals
- 🎯 **Personalized Goals**: Set and track custom fitness milestones
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Vite - Next Generation Frontend Tooling
- Chart.js - For data visualization
- Responsive & Accessible UI/UX Design
- Font Awesome Icons
- Google Fonts Integration

### Backend
- Node.js & Express.js
- Python Flask (for ML services)

### Database
- MongoDB

### AI/ML
- Hugging Face Transformers
- Custom Image Classification Model
- Indian Food Dataset Integration

### APIs
- USDA FoodData Central API
- Indian Food Composition API

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (local or MongoDB Atlas account)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SubhamPrasadAchary/LIVEFIT.git
cd LIVEFIT
```

### 2. Backend Setup (Node.js)

```bash
cd livefit-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
HUGGINGFACE_TOKEN=your_huggingface_token_here
PORT=5000
PYTHON_SERVICE_URL=http://localhost:5001
```

### 3. Python ML Service Setup

```bash
cd python_service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `python_service` directory:

```env
HUGGINGFACE_TOKEN=your_huggingface_token_here
PORT=5001
```

### 4. Frontend Setup

1.Navigate to your project directory:
```bash
cd C:\Users\MNC\LIVEFIT\FRONTEND
```
2.Install dependencies (if not already installed)
```bash
npm install
```
3.Start the server (from the FRONTEND directory)
```bash
npx vite
```
Automatically opens in your default browser at http://localhost:3000
If it doesn't open automatically, manually go to http://localhost:3000

## 🎬 Running the Project

### Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas connection string.

### Start Python ML Service

```bash
cd python_service
# Activate virtual environment if not already activated
python classifier_service.py
```

The Python service will run on `http://localhost:5001`

### Start Node.js Backend

Open a new terminal:

```bash
cd livefit-backend
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
LIVEFIT/
├── livefit-backend/
│   ├── data/
│   │   └── ifct.json                 # Indian Food Composition data
│   ├── middleware/
│   │   └── upload.js                 # File upload middleware
│   ├── public/
│   │   ├── index.html               # Main frontend file
│   │   ├── script.js                # Frontend JavaScript
│   │   └── styles.css               # Frontend styles
│   ├── python_service/
│   │   └── classifier_service.py    # ML classification service
│   ├── routes/
│   │   └── api.js                   # API routes
│   ├── services/
│   │   ├── ifct.js                  # Food composition service
│   │   ├── imageClassifier.js       # Image classification
│   │   └── indianAliases.js         # Food name aliases
│   ├── .env.example                 # Environment variables template
│   ├── package.json                 # Node dependencies
│   └── server.js                    # Main server file
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Food Search
- `GET /api/search?query=food_name` - Search for food items

### Image Classification
- `POST /api/classify` - Upload food image for classification
  - Body: `multipart/form-data` with `image` field

### Nutrition Info
- `POST /api/nutrition` - Get nutritional information
  - Body: `{ "foodName": "string", "quantity": number }`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=         # MongoDB connection string
HUGGINGFACE_TOKEN=   # Hugging Face API token
PORT=                # Backend server port (default: 5000)
PYTHON_SERVICE_URL=  # Python service URL
```

### Python Service (.env)
```env
HUGGINGFACE_TOKEN=   # Hugging Face API token
PORT=                # Python service port (default: 5001)
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using MongoDB Atlas

**Python Service Not Starting**
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5001 is already in use
- Verify Hugging Face token is valid

**Image Upload Fails**
- Check file size (default limit: 10MB)
- Ensure supported format (JPEG, PNG, JPG)
- Verify Python service is running

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Subham Prasad Achary**

- GitHub: [@SubhamPrasadAchary](https://github.com/SubhamPrasadAchary)
- Project Link: [https://github.com/SubhamPrasadAchary/LIVEFIT](https://github.com/SubhamPrasadAchary/LIVEFIT)

## 🙏 Acknowledgments

- Indian Food Composition Tables (IFCT)
- Hugging Face for ML models
- USDA FoodData Central 
- All contributors and supporters
---

⭐ If you find this project helpful, please give it a star!

**Made with ❤️ for healthy living**
