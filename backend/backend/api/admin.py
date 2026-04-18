from django.contrib import admin
from .models import Genre, Movie, WatchlistEntry, Review

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'genre', 'release_year']
    list_filter = ['genre']

@admin.register(WatchlistEntry)
class WatchlistEntryAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'status', 'rating']
    list_filter = ['status']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'score']
