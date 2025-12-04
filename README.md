Suggested commit message:
fix: improve accounts backend and fix import errors- Add register endpoint with JWT token generation- Add token refresh endpoint with consistent response format- Fix import errors in notifications and posts apps (app.accounts -> apps.accounts)- Fix syntax error in Follower model unique_together constraint- Fix typo in PostImage model (models.models.IntegerField -> models.IntegerField)- Clean up unused imports in serializers- Add missing docstrings to views and serializers- Enhance UserSerializer with followers_count and following_count fields
Shorter version:
fix: accounts backend improvements and bug fixes- Add missing register and token refresh endpoints- Fix import paths in notifications and posts apps- Fix model syntax errors and typos- Clean up code and add documentation
can u make readme github for this project, dont make file

Reviewing the project structure to draft the README:
README content:
# Social Media CloneA full-stack social media application inspired by Instagram, built with Django REST Framework backend and React Native mobile app.## 🚀 Features- **User Authentication**: JWT-based authentication with login, register, and token refresh- **User Profiles**: Customizable user profiles with bio and profile images- **Posts**: Create, view, like, and comment on posts- **Follow System**: Follow/unfollow other users- **Chat**: Real-time messaging between users- **Notifications**: Get notified about likes, comments, and follows- **Post Images**: Support for multiple images per post## 📁 Project Structure
social_media_clone/
├── backend/ # Django REST API
│ ├── apps/
│ │ ├── accounts/ # User authentication & management
│ │ ├── profiles/ # User profiles
│ │ ├── posts/ # Posts, likes, comments
│ │ ├── chat/ # Messaging system
│ │ └── notifications/# User notifications
│ └── insta_clone/ # Django project settings
└── mobile/ # React Native mobile app
└── src/
├── api/ # API client & endpoints
├── auth/ # Authentication context
├── components/ # Reusable components
├── screens/ # App screens
└── navigation/ # Navigation setup
## 🛠️ Tech Stack### Backend- **Django** 5.2.3- **Django REST Framework** 3.14.0+- **djangorestframework-simplejwt** 5.3.0+ (JWT authentication)- **django-cors-headers** 4.3.0+ (CORS handling)- **Pillow** 10.0.0+ (Image processing)- **SQLite** (Database)### Mobile- **React Native** 0.81.5- **Expo** ~54.0.25- **React Navigation** 7.x- **NativeWind** 4.2.1 (Tailwind CSS for React Native)- **Expo Secure Store** (Token storage)- **AsyncStorage** (Local storage)## 📦 Installation### Prerequisites- Python 3.8+- Node.js 18+- Expo CLI### Backend Setup1. Navigate to backend directory:cd backend2. Create virtual environment:shpython -m venv venvsource venv/bin/activate  # On Windows: venv\Scripts\activate3. Install dependencies:ashpip install -r requirements.txt4. Run migrations:python manage.py migrate5. Create superuser (optional):python manage.py createsuperuser6. Run development server:python manage.py runserverThe API will be available at `http://localhost:8000`### Mobile Setup1. Navigate to mobile directory:cd mobile2. Install dependencies:npm install3. Configure environment variables:shcp env.example .envEdit `.env` file and add your API URL:
Create virtual environment:
python -m venv venvsource venv/bin/activate  # On Windows: venv\Scripts\activate` for Android- Press `i` for iOS- Scan QR code with Expo Go app## 🔌 API Endpoints### Authentication- `POST /api/accounts/register/` - Register new user- `POST /api/accounts/login/` - Login user- `POST /api/accounts/token/refresh/` - Refresh access token- `GET /api/accounts/me/` - Get current user info### Profiles- `GET /api/profiles/me/` - Get current user profile- `PUT /api/profiles/me/` - Update current user profile- `GET /api/profiles/{id}/` - Get public profile- `POST /api/profiles/{id}/follow/` - Follow/unfollow user### Posts- `GET /api/posts/` - List all posts- `POST /api/posts/` - Create new post- `GET /api/posts/{id}/` - Get post details- `POST /api/posts/{id}/like/` - Like/unlike post- `POST /api/posts/{id}/comment/` - Add comment## 🔐 AuthenticationThe API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
Install dependencies:
pip install -r requirements.txtd and refreshed by the mobile app.## 📱 Mobile App Features- **Login/Register Screens**: User authentication- **Home Feed**: View posts from followed users- **Profile Screen**: View and edit user profile- **Post Components**: Like, comment, and share posts- **Navigation**: Bottom tab navigation## 🗄️ Database Models### User- Custom user model extending Django's AbstractUser- Fields: username, email, bio, profile_img, created_at, updated_at### Post- User posts with caption, location, and multiple images- Related models: PostImage, Like, Comment, SavedPost### Follower- Many-to-many relationship for following system### Chat- ChatRoom and Message models for messaging### Notification- User notifications for likes, comments, follows## 🧪 Development### Running Tests# Backendcd backendpython manage.py test# Mobile (if tests are set up)cd mobilenpm test### Database Migrationssh# Create migrationspython manage.py makemigrations# Apply migrationspython manage.py migrate## 📝 Environment Variables### Backend- `DJANGO_SECRET_KEY` - Django secret key (defaults to dev key)- `DEBUG` - Debug mode (default: True)### Mobile- `API_URL` - Backend API URL (e.g., http://localhost:8000)## 🤝 Contributing1. Fork the repository2. Create your feature branch (`git checkout -b feature/AmazingFeature`)3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)4. Push to the branch (`git push origin feature/AmazingFeature`)5. Open a Pull Request## 📄 LicenseThis project is licensed under the 0BSD License.## 👨‍💻 AuthorYour Name## 🙏 Acknowledgments- Django REST Framework- React Native Community- Expo Team
Run migrations:
python manage.py migrate
Create superuser (optional):
python manage.py createsuperuser
Run development server:
python manage.py runserver
The API will be available at http://localhost:8000
Mobile Setup
Navigate to mobile directory:
cd mobile
Install dependencies:
npm install
Configure environment variables:
cp env.example .env
Edit .env file and add your API URL:
API_URL=http://localhost:8000
Start Expo development server:
npm start
Run on device/emulator:
Press a for Android
Press i for iOS
Scan QR code with Expo Go app
🔌 API Endpoints
Authentication
POST /api/accounts/register/ - Register new user
POST /api/accounts/login/ - Login user
POST /api/accounts/token/refresh/ - Refresh access token
GET /api/accounts/me/ - Get current user info
Profiles
GET /api/profiles/me/ - Get current user profile
PUT /api/profiles/me/ - Update current user profile
GET /api/profiles/{id}/ - Get public profile
POST /api/profiles/{id}/follow/ - Follow/unfollow user
Posts
GET /api/posts/ - List all posts
POST /api/posts/ - Create new post
GET /api/posts/{id}/ - Get post details
POST /api/posts/{id}/like/ - Like/unlike post
POST /api/posts/{id}/comment/ - Add comment
🔐 Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
Authorization: Bearer <access_token>
Tokens are automatically stored and refreshed by the mobile app.
📱 Mobile App Features
Login/Register Screens: User authentication
Home Feed: View posts from followed users
Profile Screen: View and edit user profile
Post Components: Like, comment, and share posts
Navigation: Bottom tab navigation
🗄️ Database Models
User
Custom user model extending Django's AbstractUser
Fields: username, email, bio, profile_img, created_at, updated_at
Post
User posts with caption, location, and multiple images
Related models: PostImage, Like, Comment, SavedPost
Follower
Many-to-many relationship for following system
Chat
ChatRoom and Message models for messaging
Notification
User notifications for likes, comments, follows
🧪 Development
Running Tests
# Backendcd backendpython manage.py test# Mobile (if tests are set up)cd mobilenpm test
Database Migrations
# Create migrationspython manage.py makemigrations# Apply migrationspython manage.py migrate
📝 Environment Variables
Backend
DJANGO_SECRET_KEY - Django secret key (defaults to dev key)
DEBUG - Debug mode (default: True)
Mobile
API_URL - Backend API URL (e.g., http://localhost:8000)
