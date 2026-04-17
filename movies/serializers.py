from rest_framework import serializers
from .models import Category, Movie, Watchlist, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'movie', 'watched', 'added_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'movie', 'text', 'rating', 'created_at']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class SimpleReviewSerializer(serializers.Serializer):
    movie_id = serializers.IntegerField()
    text = serializers.CharField()
    rating = serializers.IntegerField()