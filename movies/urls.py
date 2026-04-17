from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login_view),
    path('logout/', logout_view),

    path('movies/', MovieListCreateAPIView.as_view()),
    path('movies/<int:pk>/', MovieDetailAPIView.as_view()),

    path('watchlist/', WatchlistAPIView.as_view()),
    path('watchlist/<int:pk>/', WatchlistDeleteAPIView.as_view()),

    path('reviews/', ReviewAPIView.as_view()),
]