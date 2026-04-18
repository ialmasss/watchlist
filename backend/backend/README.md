# MovieList— Movie Watchlist App

**KBTU Web Development Project | Angular + Django**

## Group Members
| Name | Role |
|------|------|
| [Student 1] | Frontend (Angular) |
| [Student 2] | Backend (Django) |
| [Student 3] | Backend / Integration |

---

## Project Description
CineList is a personal movie watchlist web application. Users can register, log in, browse movies, add them to their watchlist with statuses (Plan to Watch / Watching / Completed / Dropped), and leave reviews with scores.

---

## Tech Stack
- **Frontend:** Angular 17, TypeScript, FormsModule, HttpClient, JWT Auth Interceptor
- **Backend:** Django 4.2, Django REST Framework, Token Authentication, SQLite
- **CORS:** django-cors-headers

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # optional, for admin panel
python manage.py runserver
```

Server runs at: `http://localhost:8000`

Admin panel: `http://localhost:8000/admin`

---

## Frontend Setup

```bash
cd frontend
npm install
ng serve
```

App runs at: `http://localhost:4200`

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, returns token |
| POST | `/api/auth/logout/` | Logout (delete token) |
| GET  | `/api/auth/me/` | Get current user info |

### Movies
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/movies/` | List all movies |
| POST   | `/api/movies/` | Create movie |
| GET    | `/api/movies/{id}/` | Get movie detail |
| PUT    | `/api/movies/{id}/` | Update movie |
| PATCH  | `/api/movies/{id}/` | Partial update |
| DELETE | `/api/movies/{id}/` | Delete movie |

### Watchlist
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/watchlist/` | User's watchlist |
| POST   | `/api/watchlist/` | Add movie to watchlist |
| GET    | `/api/watchlist/{id}/` | Get entry |
| PUT    | `/api/watchlist/{id}/` | Update entry |
| PATCH  | `/api/watchlist/{id}/` | Update status/rating |
| DELETE | `/api/watchlist/{id}/` | Remove from watchlist |

### Reviews
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/movies/{id}/reviews/` | Get movie reviews |
| POST   | `/api/movies/{id}/reviews/` | Add review |
| PUT    | `/api/reviews/{id}/` | Update review |
| DELETE | `/api/reviews/{id}/` | Delete review |

### Other
| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/genres/` | List genres |
| POST   | `/api/genres/` | Create genre |
| GET    | `/api/stats/` | User watchlist stats |

---

## Backend Requirements Coverage

| Requirement | Implementation |
|-------------|----------------|
| 4 models | `Genre`, `Movie`, `WatchlistEntry`, `Review` |
| Custom model manager | `WatchlistEntryManager` with `for_user`, `by_status`, `completed`, `watching` |
| 2+ ForeignKey relationships | Movie→Genre, WatchlistEntry→User, WatchlistEntry→Movie, Review→User, Review→Movie |
| 2 plain Serializers | `LoginSerializer`, `RegisterSerializer` |
| 2+ ModelSerializers | `GenreSerializer`, `MovieSerializer`, `WatchlistEntrySerializer`, `ReviewSerializer` |
| 2+ FBV | `login_view`, `register_view`, `logout_view`, `me_view`, `stats_view` |
| 2+ CBV | `MovieListView`, `MovieDetailView`, `WatchlistView`, `WatchlistEntryDetailView`, etc. |
| Token authentication | `rest_framework.authtoken` — login/logout/all protected endpoints |
| Full CRUD | `Movie` model — GET list, GET detail, POST, PUT, PATCH, DELETE |
| Link objects to user | `serializer.save(user=request.user)` in watchlist and review views |
| CORS | `django-cors-headers`, allows `http://localhost:4200` |
| Postman collection | See `CineList.postman_collection.json` |

---

## Frontend Requirements Coverage

| Requirement | Implementation |
|-------------|----------------|
| Interfaces & Services | `Movie`, `AuthResponse` interfaces; `MovieService`, `AuthService` |
| 4+ click events with API | Login, Register, Delete movie, Change status, Save edit, Add movie |
| 4+ [(ngModel)] | username, password, email, title, genre, status, release_year... |
| CSS styling | Dark cinema theme, gold accents, responsive grid |
| 3+ named routes | `/home`, `/watchlist`, `/add-movie`, `/movie/:id`, `/login`, `/register` |
| @for / @if | Movie grid loops, conditional empty states, auth-dependent navbar |
| JWT interceptor | `auth.interceptor.ts` — attaches `Authorization: Token ...` header |
| Angular Service HttpClient | `MovieService` and `AuthService` using `HttpClient` |
| Error handling | `error-banner` shown on all failed requests |
