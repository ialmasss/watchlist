from django.contrib import admin
from .models import Category, Movie, Watchlist, Review

admin.site.register(Category)
admin.site.register(Movie)
admin.site.register(Watchlist)
admin.site.register(Review)