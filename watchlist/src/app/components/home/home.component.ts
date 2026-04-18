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
        <div class="hero-text">
          <h1>Hey, <span class="gold">{{ auth.getUsername() }}</span> 👋</h1>
          <p>Your personal MovieList journal. Track what you've watched, what you're watching, and what's next.</p>
        </div>
        <a routerLink="/add-movie" class="btn-add-hero">+ Add Movie</a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-num">{{ getCount('plan_to_watch') }}</span>
          <span class="stat-label">Plan to Watch</span>
          <div class="stat-bar" style="--fill: 0.3; --clr: #e0a060"></div>
        </div>
        <div class="stat-card">
          <span class="stat-num watching">{{ getCount('watching') }}</span>
          <span class="stat-label">Watching Now</span>
          <div class="stat-bar" style="--fill: 0.5; --clr: #60a0e0"></div>
        </div>
        <div class="stat-card">
          <span class="stat-num completed">{{ getCount('completed') }}</span>
          <span class="stat-label">Completed</span>
          <div class="stat-bar" style="--fill: 0.8; --clr: #4dd47a"></div>
        </div>
        <div class="stat-card">
          <span class="stat-num dropped">{{ getCount('dropped') }}</span>
          <span class="stat-label">Dropped</span>
          <div class="stat-bar" style="--fill: 0.1; --clr: #e06060"></div>
        </div>
      </div>

      @if (errorMessage) {
        <div class="error-banner">{{ errorMessage }}</div>
      }

      <div class="section">
        <div class="section-header">
          <h2>Recently Added</h2>
          @if (movies.length > 0) {
            <a routerLink="/watchlist" class="section-link">View all →</a>
          }
        </div>

        @if (loading) {
          <div class="loading-grid">
            @for (item of [1,2,3,4,5,6]; track item) {
              <div class="skeleton-card"></div>
            }
          </div>
        } @else if (movies.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🎞️</div>
            <p>No movies yet. <a routerLink="/add-movie">Add your first one!</a></p>
          </div>
        } @else {
          <div class="movies-grid">
            @for (movie of movies.slice(0, 6); track movie.id) {
              <a [routerLink]="['/movie', movie.id]" class="movie-card">
                <div class="poster">
                  @if (movie.poster_url) {
                    <img [src]="movie.poster_url" [alt]="movie.title" />
                  } @else {
                    <div class="poster-icon">🎬</div>
                  }
                  <span class="status-pill" [class]="'pill-' + movie.status">
                    {{ statusLabel(movie.status) }}
                  </span>
                </div>
                <div class="card-meta">
                  <div class="card-title">{{ movie.title }}</div>
                  <div class="card-sub">{{ movie.genre }} · {{ movie.release_year }}</div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      padding: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.75rem;
      gap: 1rem;
    }
    .hero h1 {
      font-size: 1.7rem;
      font-weight: 700;
      color: #f0f0ff;
      margin-bottom: 0.35rem;
    }
    .gold { color: #c8a96e; }
    .hero p { color: #66688a; font-size: 0.9rem; max-width: 480px; line-height: 1.6; }
    .btn-add-hero {
      flex-shrink: 0;
      padding: 0.65rem 1.4rem;
      background: #c8a96e;
      color: #0b0c14;
      border-radius: 9px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      white-space: nowrap;
      transition: background 0.2s;
    }
    .btn-add-hero:hover { background: #dfc08a; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.85rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      padding: 1.1rem 1.2rem;
      position: relative;
      overflow: hidden;
    }
    .stat-num {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #c8a96e;
      line-height: 1;
      margin-bottom: 0.3rem;
    }
    .stat-num.watching { color: #60a0e0; }
    .stat-num.completed { color: #4dd47a; }
    .stat-num.dropped { color: #e06060; }
    .stat-label { font-size: 0.78rem; color: #66688a; font-weight: 500; }
    .stat-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: calc(var(--fill) * 100%);
      background: var(--clr);
      border-radius: 0 3px 0 0;
      opacity: 0.6;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .section-header h2 { font-size: 1rem; font-weight: 600; color: #f0f0ff; }
    .section-link { color: #c8a96e; font-size: 0.83rem; text-decoration: none; }
    .section-link:hover { text-decoration: underline; }
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.85rem;
    }
    .movie-card {
      text-decoration: none;
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
      display: block;
    }
    .movie-card:hover { transform: translateY(-4px); border-color: rgba(200,169,110,0.4); }
    .poster {
      aspect-ratio: 2/3;
      background: #1e203a;
      position: relative;
      overflow: hidden;
    }
    .poster img { width: 100%; height: 100%; object-fit: cover; }
    .poster-icon {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem;
    }
    .status-pill {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      font-size: 0.62rem;
      font-weight: 600;
      padding: 0.18rem 0.5rem;
      border-radius: 20px;
    }
    .pill-watching { background: #1a3a5a; color: #60a0e0; }
    .pill-completed { background: #1a3a1a; color: #4dd47a; }
    .pill-plan_to_watch { background: #3a2a1a; color: #e0a060; }
    .pill-dropped { background: #3a1a1a; color: #e06060; }
    .card-meta { padding: 0.6rem 0.7rem; }
    .card-title {
      color: #f0f0ff;
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.15rem;
    }
    .card-sub { color: #66688a; font-size: 0.72rem; }
    .loading-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.85rem; }
    .skeleton-card {
      aspect-ratio: 2/3;
      background: #161728;
      border-radius: 10px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 4rem 2rem; color: #66688a; gap: 0.75rem;
    }
    .empty-icon { font-size: 3rem; }
    .empty-state a { color: #c8a96e; text-decoration: none; }
    .error-banner {
      background: rgba(220,60,60,0.08);
      border: 1px solid rgba(220,60,60,0.25);
      color: #e06060;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 800px) {
      .stats-grid { grid-template-columns: repeat(2,1fr); }
      .movies-grid, .loading-grid { grid-template-columns: repeat(3,1fr); }
      .hero { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 500px) {
      .movies-grid, .loading-grid { grid-template-columns: repeat(2,1fr); }
    }
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

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      watching: 'Watching',
      completed: 'Done',
      plan_to_watch: 'Planned',
      dropped: 'Dropped'
    };
    return map[status] || status;
  }
}