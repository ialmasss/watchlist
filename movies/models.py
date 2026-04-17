from django.db import models
from django.contrib.auth.models import User


# 1. Category（电影分类）
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# ⭐ 自定义 Manager（加分点）
class MovieManager(models.Manager):
    def recent_movies(self):
        return self.filter(release_year__gte=2020)


# 2. Movie（电影）
class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    release_year = models.IntegerField()

    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    # 使用自定义 manager
    objects = MovieManager()

    def __str__(self):
        return self.title


# 3. Watchlist（用户收藏电影）
class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    # ⭐ 小特色（可以讲）
    watched = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


# 4. Review（评论）
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    text = models.TextField()

    # ⭐ 小特色（评分）
    rating = models.IntegerField(default=5)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} review on {self.movie.title}"