<<<<<<< HEAD
# Social Media Clone

A full-stack social media application inspired by Instagram, built with Django REST Framework backend and React Native mobile app.

## 🚀 Features

- **User Authentication**: JWT-based authentication with login, register, and token refresh
- **User Profiles**: Customizable user profiles with bio and profile images
- **Posts**: Create, view, like, and comment on posts
- **Follow System**: Follow/unfollow other users
- **Chat**: Real-time messaging between users
- **Notifications**: Get notified about likes, comments, and follows
- **Post Images**: Support for multiple images per post

## 📁 Project Structure

```
social_media_clone/
├── backend/          # Django REST API
│   ├── apps/
│   │   ├── accounts/     # User authentication & management
│   │   ├── profiles/     # User profiles
│   │   ├── posts/        # Posts, likes, comments
│   │   ├── chat/         # Messaging system
│   │   └── notifications/# User notifications
│   └── insta_clone/      # Django project settings
└── mobile/           # React Native mobile app
    └── src/
        ├── api/          # API client & endpoints
        ├── auth/         # Authentication context
        ├── components/   # Reusable components
        ├── screens/      # App screens
        └── navigation/   # Navigation setup
```

## 🛠️ Tech Stack

### Backend
- **Django** 5.2.3
- **Django REST Framework** 3.14.0+
- **djangorestframework-simplejwt** 5.3.0+ (JWT authentication)
- **django-cors-headers** 4.3.0+ (CORS handling)
- **Pillow** 10.0.0+ (Image processing)
- **SQLite** (Database)

### Mobile
- **React Native** 0.81.5
- **Expo** ~54.0.25
- **React Navigation** 7.x
- **NativeWind** 4.2.1 (Tailwind CSS for React Native)
- **Expo Secure Store** (Token storage)
- **AsyncStorage** (Local storage)

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- Expo CLI

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Seed database with test data (optional, for development):
```bash
python manage.py seed_users
```

This will create:
- Admin user: `admin` / `admin123`
- Test users: `johndoe`, `janedoe`, `alice`, `bob`, `charlie` (password: `password123`)

Options:
- `--admin-only`: Only create admin user
- `--users-only`: Only create regular users
- `--count N`: Create N regular users (default: 5)

7. Run development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env
```

Edit `.env` file and add your API URL:
```
API_URL=http://localhost:8000
```

4. Start Expo development server:
```bash
npm start
```

5. Run on device/emulator:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## 🔌 API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - Login user
- `POST /api/accounts/token/refresh/` - Refresh access token
- `GET /api/accounts/me/` - Get current user info

### Profiles
- `GET /api/profiles/me/` - Get current user profile
- `PUT /api/profiles/me/` - Update current user profile
- `GET /api/profiles/{id}/` - Get public profile
- `POST /api/profiles/{id}/follow/` - Follow/unfollow user

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get post details
- `POST /api/posts/{id}/like/` - Like/unlike post
- `POST /api/posts/{id}/comment/` - Add comment

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are automatically stored and refreshed by the mobile app.

## 📱 Mobile App Features

- **Login/Register Screens**: User authentication
- **Home Feed**: View posts from followed users
- **Profile Screen**: View and edit user profile
- **Post Components**: Like, comment, and share posts
- **Navigation**: Bottom tab navigation

## 🗄️ Database Models

### User
- Custom user model extending Django's AbstractUser
- Fields: username, email, bio, profile_img, created_at, updated_at

### Post
- User posts with caption, location, and multiple images
- Related models: PostImage, Like, Comment, SavedPost

### Follower
- Many-to-many relationship for following system

### Chat
- ChatRoom and Message models for messaging

### Notification
- User notifications for likes, comments, follows

## 🧪 Development

### Running Tests
```bash
# Backend
cd backend
python manage.py test

# Mobile (if tests are set up)
cd mobile
npm test
```

### Database Migrations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Seeding Test Data
```bash
# Seed with default users (admin + 5 test users)
python manage.py seed_users

# Only create admin user
python manage.py seed_users --admin-only

# Only create regular users
python manage.py seed_users --users-only

# Create custom number of users
python manage.py seed_users --count 10
```

**Default Test Credentials:**
- Admin: `admin` / `admin123`
- Test Users: `johndoe`, `janedoe`, `alice`, `bob`, `charlie` / `password123`

## 📝 Environment Variables

### Backend
- `DJANGO_SECRET_KEY` - Django secret key (defaults to dev key)
- `DEBUG` - Debug mode (default: True)

### Mobile
- `API_URL` - Backend API URL (e.g., http://localhost:8000)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Django REST Framework
- React Native Community
- Expo Team


=======
>>>>>>> 5e770aa802cdd410996125975766722f4959d9d2

