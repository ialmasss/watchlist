from django.db import models
from django.contrib.auth.models import User


class WatchlistEntryManager(models.Manager):
    """Custom model manager."""
    def for_user(self, user):
        return self.filter(user=user)

    def by_status(self, user, status):
        return self.filter(user=user, status=status)

    def completed(self, user):
        return self.filter(user=user, status='completed')

    def watching(self, user):
        return self.filter(user=user, status='watching')


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    poster_url = models.URLField(blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name='movies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class WatchlistEntry(models.Model):
    STATUS_CHOICES = [
        ('plan_to_watch', 'Plan to Watch'),
        ('watching', 'Watching'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='watchlist_entries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='plan_to_watch')
    rating = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = WatchlistEntryManager()

    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.status})"

    class Meta:
        ordering = ['-added_at']
        unique_together = ['user', 'movie']


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    score = models.IntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} review for {self.movie.title}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'movie']
