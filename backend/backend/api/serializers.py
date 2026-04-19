from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Genre, Movie, WatchlistEntry, Review


# ══════════════════════════════════════════════════════
# serializers.Serializer (plain, manual) — 2 required
# ══════════════════════════════════════════════════════

class LoginSerializer(serializers.Serializer):
    """Plain Serializer #1 — used for login validation."""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class RegisterSerializer(serializers.Serializer):
    """Plain Serializer #2 — used for user registration."""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


# ══════════════════════════════════════════════════════
# serializers.ModelSerializer — 2 required
# ══════════════════════════════════════════════════════

class GenreSerializer(serializers.ModelSerializer):
    """ModelSerializer #1 — Genre."""
    movie_count = serializers.SerializerMethodField()

    class Meta:
        model = Genre
        fields = ['id', 'name', 'description', 'movie_count']

    def get_movie_count(self, obj):
        return obj.movies.count()


class MovieSerializer(serializers.ModelSerializer):
    """ModelSerializer #2 — Movie with nested genre name."""
    genre_name = serializers.CharField(source='genre.name', read_only=True)

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_year', 'poster_url',
                  'genre', 'genre_name', 'created_at']
        read_only_fields = ['created_at']


class WatchlistEntrySerializer(serializers.ModelSerializer):
    """ModelSerializer #3 — WatchlistEntry."""
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_poster = serializers.CharField(source='movie.poster_url', read_only=True)
    movie_genre = serializers.CharField(source='movie.genre.name', read_only=True)
    movie_year = serializers.IntegerField(source='movie.release_year', read_only=True)

    class Meta:
        model = WatchlistEntry
        fields = ['id', 'movie', 'movie_title', 'movie_poster', 'movie_genre',
                  'movie_year', 'status', 'rating', 'notes', 'added_at', 'updated_at']
        read_only_fields = ['added_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    """ModelSerializer #4 — Review."""
    username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'movie', 'movie_title', 'username', 'score', 'text', 'created_at']
        read_only_fields = ['created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
