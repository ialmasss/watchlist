from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate

from .models import Movie, Watchlist, Review
from .serializers import (
    MovieSerializer,
    WatchlistSerializer,
    ReviewSerializer,
    LoginSerializer,
)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


# FBV: login
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })

        return Response({'error': 'Invalid credentials'}, status=400)

    return Response(serializer.errors, status=400)


# FBV: logout
@api_view(['POST'])
def logout_view(request):
    return Response({'message': 'Logged out successfully'})


# CBV: movies list + create
class MovieListCreateAPIView(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# CBV: movie detail + update + delete
class MovieDetailAPIView(APIView):
    def get(self, request, pk):
        movie = Movie.objects.get(id=pk)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

    def put(self, request, pk):
        movie = Movie.objects.get(id=pk)
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        movie = Movie.objects.get(id=pk)
        movie.delete()
        return Response({'message': 'Movie deleted successfully'})


# Watchlist
class WatchlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Watchlist.objects.filter(user=request.user)
        serializer = WatchlistSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WatchlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class WatchlistDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = Watchlist.objects.get(id=pk, user=request.user)
        item.delete()
        return Response({'message': 'Removed from watchlist'})


# Reviews
class ReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)