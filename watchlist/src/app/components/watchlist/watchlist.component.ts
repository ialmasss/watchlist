import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="watchlist-page">
      <div class="page-header">
        <div>
          <h1>MovieList</h1>
          <p class="header-sub">{{ movies.length }} movies total</p>
        </div>
        <a routerLink="/add-movie" class="btn-add">+ Add Movie</a>
      </div>

      <div class="filter-tabs">
        @for (f of filters; track f.value) {
          <button
            class="tab"
            [class.active]="selectedStatus === f.value"
            (click)="setFilter(f.value)"
          >
            {{ f.label }}
            <span class="tab-count">{{ getCount(f.value) }}</span>
          </button>
        }
      </div>

      @if (errorMessage) {
        <div class="error-banner">{{ errorMessage }}</div>
      }

      @if (loading) {
        <div class="skeleton-list">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton-row"></div>
          }
        </div>
      } @else if (filteredMovies.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>No movies here. <a routerLink="/add-movie">Add one!</a></p>
        </div>
      } @else {
        <div class="movie-list">
          @for (movie of filteredMovies; track movie.id) {
            <div class="movie-row">
              <div class="row-poster">
                @if (movie.poster_url) {
                  <img [src]="movie.poster_url" [alt]="movie.title" />
                } @else {
                  <div class="poster-ph">🎬</div>
                }
              </div>

              <div class="row-info">
                <div class="row-title">{{ movie.title }}</div>
                <div class="row-meta">{{ movie.genre }} · {{ movie.release_year }}</div>
              </div>

              <div class="row-status">
                <select
                  [ngModel]="movie.status"
                  (ngModelChange)="onStatusChange(movie, $event)"
                  class="status-select"
                  [class]="'sel-' + movie.status"
                >
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>

              <div class="row-actions">
                <a [routerLink]="['/movie', movie.id]" class="btn-view">View</a>
                <button class="btn-del" (click)="onDelete(movie.id)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .watchlist-page {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    h1 { font-size: 1.4rem; font-weight: 700; color: #f0f0ff; margin-bottom: 0.2rem; }
    .header-sub { color: #66688a; font-size: 0.85rem; }
    .btn-add {
      padding: 0.6rem 1.3rem;
      background: #c8a96e;
      color: #0b0c14;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.87rem;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .btn-add:hover { background: #dfc08a; }

    .filter-tabs {
      display: flex;
      gap: 0.35rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 7px;
      color: #66688a;
      font-family: inherit;
      font-size: 0.83rem;
      cursor: pointer;
      transition: all 0.18s;
    }
    .tab:hover { color: #f0f0ff; border-color: rgba(255,255,255,0.15); }
    .tab.active {
      background: rgba(200,169,110,0.12);
      border-color: rgba(200,169,110,0.35);
      color: #c8a96e;
    }
    .tab-count {
      background: rgba(255,255,255,0.08);
      color: #66688a;
      font-size: 0.72rem;
      padding: 0.1rem 0.45rem;
      border-radius: 10px;
    }
    .tab.active .tab-count {
      background: rgba(200,169,110,0.15);
      color: #c8a96e;
    }

    .movie-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .movie-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      transition: border-color 0.18s;
    }
    .movie-row:hover { border-color: rgba(255,255,255,0.14); }

    .row-poster {
      width: 38px;
      height: 54px;
      background: #1e203a;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .row-poster img { width: 100%; height: 100%; object-fit: cover; }
    .poster-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

    .row-info { flex: 1; min-width: 0; }
    .row-title {
      color: #f0f0ff;
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row-meta { color: #66688a; font-size: 0.78rem; margin-top: 0.1rem; }

    .status-select {
      padding: 0.35rem 0.75rem;
      background: #0f1020;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.78rem;
      cursor: pointer;
    }
    .sel-watching { color: #60a0e0; }
    .sel-completed { color: #4dd47a; }
    .sel-plan_to_watch { color: #e0a060; }
    .sel-dropped { color: #e06060; }

    .row-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
    .btn-view {
      padding: 0.35rem 0.8rem;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 6px;
      color: #a0a0c0;
      text-decoration: none;
      font-size: 0.78rem;
      transition: all 0.18s;
    }
    .btn-view:hover { border-color: #c8a96e; color: #c8a96e; }
    .btn-del {
      padding: 0.35rem 0.8rem;
      border: 1px solid rgba(220,80,80,0.25);
      border-radius: 6px;
      color: #e06060;
      background: transparent;
      font-family: inherit;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.18s;
    }
    .btn-del:hover { background: rgba(220,80,80,0.08); }

    .skeleton-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .skeleton-row {
      height: 72px;
      background: #161728;
      border-radius: 10px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 4rem 2rem; color: #66688a; gap: 0.75rem;
    }
    .empty-icon { font-size: 2.5rem; }
    .empty-state a { color: #c8a96e; text-decoration: none; }

    .error-banner {
      background: rgba(220,60,60,0.08);
      border: 1px solid rgba(220,60,60,0.25);
      color: #e06060;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1rem;
    }
  `]
})
export class WatchlistComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  selectedStatus = '';
  loading = true;
  errorMessage = '';

  filters = [
    { label: 'All', value: '' },
    { label: 'Watching', value: 'watching' },
    { label: 'Completed', value: 'completed' },
    { label: 'Plan to Watch', value: 'plan_to_watch' },
    { label: 'Dropped', value: 'dropped' },
  ];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (data) => { this.movies = data; this.applyFilter(); this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Failed to load MovieList.';
      }
    });
  }

  setFilter(value: string): void {
    this.selectedStatus = value;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredMovies = this.selectedStatus
      ? this.movies.filter(m => m.status === this.selectedStatus)
      : [...this.movies];
  }

  getCount(status: string): number {
    if (!status) return this.movies.length;
    return this.movies.filter(m => m.status === status).length;
  }

  onStatusChange(movie: Movie, newStatus: string): void {
    this.movieService.updateStatus(movie.id, newStatus).subscribe({
      next: (updated) => { movie.status = updated.status; this.applyFilter(); },
      error: (err) => { this.errorMessage = err.error?.detail || 'Failed to update status.'; }
    });
  }

  onDelete(id: number): void {
    if (!confirm('Remove this movie from your MovieList?')) return;
    this.movieService.deleteMovie(id).subscribe({
      next: () => { this.movies = this.movies.filter(m => m.id !== id); this.applyFilter(); },
      error: (err) => { this.errorMessage = err.error?.detail || 'Failed to delete movie.'; }
    });
  }
}