from django.urls import path
from . import views

urlpatterns = [
    # Auth (FBV)
    path('auth/login/',    views.login_view,    name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/',   views.logout_view,   name='logout'),
    path('auth/me/',       views.me_view,       name='me'),

    # Stats (FBV)
    path('stats/', views.stats_view, name='stats'),

    # Genres (CBV)
    path('genres/', views.GenreListView.as_view(), name='genre-list'),

    # Movies (CBV — full CRUD)
    path('movies/',      views.MovieListView.as_view(),   name='movie-list'),
    path('movies/<int:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),

    # Reviews (CBV)
    path('movies/<int:movie_pk>/reviews/', views.ReviewListView.as_view(),  name='review-list'),
    path('reviews/<int:pk>/',              views.ReviewDetailView.as_view(), name='review-detail'),

    # Watchlist (CBV — full CRUD, linked to user)
    path('watchlist/',         views.WatchlistView.as_view(),            name='watchlist'),
    path('watchlist/<int:pk>/', views.WatchlistEntryDetailView.as_view(), name='watchlist-detail'),
]
