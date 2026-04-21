# MovieList — Web Development Project
A web application designed to help users track movies they want to watch, are currently watching, or have completed. Built using Angular 17 for the frontend and Django REST Framework (DRF) for the backend.

Team Members
Almas Zhaksybay — Frontend Development (Angular)

Symbat Duman — Backend Development (Django)

Arsen Shakirov — Database & Documentation (Postman/QA)

Key Requirements Checklist
Frontend (Angular)
Architecture: 1 central Angular Service using HttpClient for all API communication.

Modern Syntax: Implemented using Angular 17+ @for loops and @if conditional rendering.

Forms & Events: At least 4 (click) events and 4 form controls using [(ngModel)].

Routing: Navigation between 3+ named routes (/home, /watchlist, /add-movie, etc.).

Security: JWT/Token authentication with an HTTP Interceptor and a dedicated Login/Logout flow.

Error Handling: Graceful API error messages displayed to the user via UI alerts.

Backend (Django + DRF)
Models: 4 models (Genre, UserMovie, Review, WatchHistory) with at least 2 ForeignKey relationships.

Logic: 1 Custom Model Manager for user-specific filtering.

Serializers: Mixed use of serializers.Serializer (2) and serializers.ModelSerializer (2).

Views: Combination of Function-Based Views (FBV) and Class-Based Views (CBV).

Authentication: Token-based authentication with logic linking objects to request.user.

CORS: Configured via django-cors-headers to allow Angular dev-server requests.

Installation & Setup
Backend Setup
Bash
# Navigate to backend folder
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend Setup
Bash
# Navigate to frontend folder
npm install
ng serve
The app will be available at http://localhost:4200.

Project Structure & Features
Full CRUD: Users can Create, Read, Update, and Delete movies from their personal watchlist.

Watch History: The system automatically logs status changes (e.g., from "Watching" to "Completed") in a separate history model.

Postman: A full collection of API requests is included in the root directory: MovieList_Collection.json.

Uniqueness
Unlike basic watchlists, our project features a WatchHistory log and custom stats, giving users a clear overview of their movie-watching habits over time.
