from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .models import Genre, Movie, WatchlistEntry, Review
from .serializers import (
    LoginSerializer, RegisterSerializer,
    GenreSerializer, MovieSerializer,
    WatchlistEntrySerializer, ReviewSerializer, UserSerializer,
)


# ── FBV #1: Login ─────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if not user:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.id, 'username': user.username, 'email': user.email})


# ── FBV #2: Register ──────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.id, 'username': user.username, 'email': user.email}, status=status.HTTP_201_CREATED)


# ── FBV #3: Logout ────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({'detail': 'Logged out successfully.'})


# ── FBV #4: Me ───────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


# ── FBV #5: Stats ────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_view(request):
    user = request.user
    entries = WatchlistEntry.objects.for_user(user)
    return Response({
        'total': entries.count(),
        'watching': WatchlistEntry.objects.watching(user).count(),
        'completed': WatchlistEntry.objects.completed(user).count(),
        'plan_to_watch': WatchlistEntry.objects.by_status(user, 'plan_to_watch').count(),
        'dropped': WatchlistEntry.objects.by_status(user, 'dropped').count(),
    })


# ── CBV #1: Genres ───────────────────────────────────
class GenreListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = GenreSerializer(Genre.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── CBV #2: Movie List ───────────────────────────────
class MovieListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.all()
        genre_id = request.query_params.get('genre')
        search = request.query_params.get('search')
        if genre_id:
            movies = movies.filter(genre_id=genre_id)
        if search:
            movies = movies.filter(title__icontains=search)
        return Response(MovieSerializer(movies, many=True).data)

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── CBV #3: Movie Detail (full CRUD) ─────────────────
class MovieDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MovieSerializer(movie).data)

    def put(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if not movie:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── CBV #4: Watchlist List ───────────────────────────
class WatchlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get('status')
        if status_filter:
            entries = WatchlistEntry.objects.by_status(request.user, status_filter)
        else:
            entries = WatchlistEntry.objects.for_user(request.user)
        return Response(WatchlistEntrySerializer(entries, many=True).data)

    def post(self, request):
        serializer = WatchlistEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # link to authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── CBV #5: Watchlist Entry Detail ───────────────────
class WatchlistEntryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return WatchlistEntry.objects.get(pk=pk, user=user)
        except WatchlistEntry.DoesNotExist:
            return None

    def get(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(WatchlistEntrySerializer(entry).data)

    def put(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WatchlistEntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WatchlistEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── CBV #6: Reviews ──────────────────────────────────
class ReviewListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, movie_pk):
        reviews = Review.objects.filter(movie_id=movie_pk)
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, movie_pk):
        try:
            movie = Movie.objects.get(pk=movie_pk)
        except Movie.DoesNotExist:
            return Response({'detail': 'Movie not found.'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['movie'] = movie.id
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user, movie=movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── CBV #7: Review Detail ────────────────────────────
class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Review.objects.get(pk=pk, user=user)
        except Review.DoesNotExist:
            return None

    def put(self, request, pk):
        review = self.get_object(pk, request.user)
        if not review:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self.get_object(pk, request.user)
        if not review:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
