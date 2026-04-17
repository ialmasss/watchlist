import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <div class="hero">
        <h1>Welcome back, <span class="highlight">{{ auth.getUsername() }}</span> 👋</h1>
        <p>Track movies you want to watch, are watching, or have completed.</p>
        <a routerLink="/add-movie" class="btn-hero">+ Add a Movie</a>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ getCount('plan_to_watch') }}</span>
          <span class="stat-label">Plan to Watch</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ getCount('watching') }}</span>
          <span class="stat-label">Watching</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ getCount('completed') }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ getCount('dropped') }}</span>
          <span class="stat-label">Dropped</span>
        </div>
      </div>

      @if (errorMessage) {
        <div class="error-banner">{{ errorMessage }}</div>
      }

      <div class="section">
        <h2>Recently Added</h2>
        @if (loading) {
          <div class="loading">Loading movies...</div>
        } @else if (movies.length === 0) {
          <div class="empty-state">
            <span>🎞️</span>
            <p>No movies yet. <a routerLink="/add-movie">Add your first one!</a></p>
          </div>
        } @else {
          <div class="movies-grid">
            @for (movie of movies.slice(0, 6); track movie.id) {
              <div class="movie-card">
                <div class="movie-poster">
                  @if (movie.poster_url) {
                    <img [src]="movie.poster_url" [alt]="movie.title" />
                  } @else {
                    <div class="poster-placeholder">🎬</div>
                  }
                  <span class="status-badge" [class]="'status-' + movie.status">
                    {{ formatStatus(movie.status) }}
                  </span>
                </div>
                <div class="movie-info">
                  <h3>{{ movie.title }}</h3>
                  <p class="genre">{{ movie.genre }} · {{ movie.release_year }}</p>
                </div>
                <a [routerLink]="['/movie', movie.id]" class="card-link"></a>
              </div>
            }
          </div>
        }

        @if (movies.length > 0) {
          <a routerLink="/watchlist" class="btn-secondary">View Full Watchlist →</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .home-page { padding: 2rem; max-width: 1100px; margin: 0 auto; background: #0a0a14; min-height: 100vh; }
    .hero { margin-bottom: 2rem; }
    .hero h1 { color: #f0f0ff; font-size: 1.8rem; margin: 0 0 0.5rem; }
    .highlight { color: #e2b96a; }
    .hero p { color: #6060a0; margin: 0 0 1.2rem; }
    .btn-hero {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #e2b96a;
      color: #0f0f1a;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      transition: background 0.2s;
    }
    .btn-hero:hover { background: #f0c97a; }
    .stats-row { display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
    .stat-card {
      flex: 1; min-width: 100px;
      background: #0f0f1a;
      border: 1px solid #2a2a3e;
      border-radius: 12px;
      padding: 1.2rem;
      text-align: center;
    }
    .stat-num { display: block; font-size: 2rem; font-weight: 700; color: #e2b96a; }
    .stat-label { color: #6060a0; font-size: 0.8rem; }
    .section h2 { color: #f0f0ff; margin: 0 0 1.2rem; }
    .movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .movie-card {
      background: #0f0f1a;
      border: 1px solid #2a2a3e;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      transition: transform 0.2s, border-color 0.2s;
    }
    .movie-card:hover { transform: translateY(-3px); border-color: #e2b96a; }
    .movie-poster { position: relative; aspect-ratio: 2/3; background: #1a1a2e; }
    .movie-poster img { width: 100%; height: 100%; object-fit: cover; }
    .poster-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .status-badge {
      position: absolute; top: 0.4rem; right: 0.4rem;
      font-size: 0.65rem; padding: 0.2rem 0.5rem;
      border-radius: 4px; font-weight: 600;
    }
    .status-watching { background: #1a3a5a; color: #60a0e0; }
    .status-completed { background: #1a3a1a; color: #60e060; }
    .status-plan_to_watch { background: #3a2a1a; color: #e0a060; }
    .status-dropped { background: #3a1a1a; color: #e06060; }
    .movie-info { padding: 0.75rem; }
    .movie-info h3 { color: #f0f0ff; font-size: 0.85rem; margin: 0 0 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .genre { color: #6060a0; font-size: 0.75rem; margin: 0; }
    .card-link { position: absolute; inset: 0; }
    .btn-secondary {
      display: inline-block; padding: 0.6rem 1.2rem;
      border: 1px solid #2a2a3e; color: #a0a0c0;
      border-radius: 8px; text-decoration: none; font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #e2b96a; color: #e2b96a; }
    .loading, .empty-state { color: #6060a0; text-align: center; padding: 3rem; }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state a { color: #e2b96a; }
    .error-banner { background: #2a1a1a; border: 1px solid #c0404040; color: #e06060; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
  `]
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  errorMessage = '';

  constructor(public auth: AuthService, private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => { this.movies = data; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Failed to load movies.';
      }
    });
  }

  getCount(status: string): number {
    return this.movies.filter(m => m.status === status).length;
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      watching: 'Watching',
      completed: 'Completed',
      plan_to_watch: 'Plan to Watch',
      dropped: 'Dropped'
    };
    return map[status] || status;
  }
}