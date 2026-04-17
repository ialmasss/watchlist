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
        <h1>My Watchlist</h1>
        <a routerLink="/add-movie" class="btn-add">+ Add Movie</a>
      </div>

      <div class="filters">
        <label>Filter by status:</label>
        <!-- ngModel for filter — click event #3 on filter change -->
        <select [(ngModel)]="selectedStatus" class="filter-select" (ngModelChange)="onFilterChange()">
          <option value="">All</option>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="plan_to_watch">Plan to Watch</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      @if (errorMessage) {
        <div class="error-banner">{{ errorMessage }}</div>
      }

      @if (loading) {
        <div class="loading">Loading your watchlist...</div>
      } @else if (filteredMovies.length === 0) {
        <div class="empty-state">
          <span>📭</span>
          <p>No movies found. <a routerLink="/add-movie">Add one!</a></p>
        </div>
      } @else {
        <div class="movie-list">
          @for (movie of filteredMovies; track movie.id) {
            <div class="movie-row">
              <div class="movie-poster-small">
                @if (movie.poster_url) {
                  <img [src]="movie.poster_url" [alt]="movie.title" />
                } @else {
                  <div class="poster-ph">🎬</div>
                }
              </div>
              <div class="movie-meta">
                <h3>{{ movie.title }}</h3>
                <p>{{ movie.genre }} · {{ movie.release_year }}</p>
              </div>
              <div class="movie-status">
                <select
                  [ngModel]="movie.status"
                  (ngModelChange)="onStatusChange(movie, $event)"
                  class="status-select"
                  [class]="'status-' + movie.status"
                >
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
              <div class="movie-actions">
                <!-- click event #3: view detail -->
                <a [routerLink]="['/movie', movie.id]" class="btn-view">View</a>
                <!-- click event #4: delete -->
                <button class="btn-delete" (click)="onDelete(movie.id)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .watchlist-page { padding: 2rem; max-width: 900px; margin: 0 auto; background: #0a0a14; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { color: #f0f0ff; margin: 0; }
    .btn-add {
      padding: 0.6rem 1.2rem;
      background: #e2b96a; color: #0f0f1a;
      border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem;
    }
    .filters { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .filters label { color: #a0a0c0; font-size: 0.9rem; }
    .filter-select, .status-select {
      padding: 0.5rem 1rem;
      background: #1a1a2e; border: 1px solid #2a2a3e;
      border-radius: 6px; color: #f0f0ff; font-size: 0.85rem; cursor: pointer;
    }
    .movie-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .movie-row {
      display: flex; align-items: center; gap: 1rem;
      background: #0f0f1a; border: 1px solid #2a2a3e;
      border-radius: 10px; padding: 0.75rem;
      transition: border-color 0.2s;
    }
    .movie-row:hover { border-color: #3a3a5e; }
    .movie-poster-small { width: 50px; height: 70px; border-radius: 6px; overflow: hidden; flex-shrink: 0; background: #1a1a2e; }
    .movie-poster-small img { width: 100%; height: 100%; object-fit: cover; }
    .poster-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .movie-meta { flex: 1; }
    .movie-meta h3 { color: #f0f0ff; margin: 0 0 0.2rem; font-size: 1rem; }
    .movie-meta p { color: #6060a0; margin: 0; font-size: 0.8rem; }
    .movie-actions { display: flex; gap: 0.5rem; }
    .btn-view {
      padding: 0.4rem 0.8rem;
      border: 1px solid #2a2a3e; color: #a0a0c0;
      border-radius: 6px; text-decoration: none; font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-view:hover { border-color: #e2b96a; color: #e2b96a; }
    .btn-delete {
      padding: 0.4rem 0.8rem;
      border: 1px solid #c0404040; color: #e06060;
      background: transparent; border-radius: 6px; cursor: pointer; font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-delete:hover { background: #2a1a1a; }
    .status-watching { color: #60a0e0; }
    .status-completed { color: #60e060; }
    .status-plan_to_watch { color: #e0a060; }
    .status-dropped { color: #e06060; }
    .loading, .empty-state { color: #6060a0; text-align: center; padding: 3rem; }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state a { color: #e2b96a; }
    .error-banner { background: #2a1a1a; border: 1px solid #c0404040; color: #e06060; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
  `]
})
export class WatchlistComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  selectedStatus = '';
  loading = true;
  errorMessage = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Failed to load watchlist.';
      }
    });
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredMovies = this.selectedStatus
      ? this.movies.filter(m => m.status === this.selectedStatus)
      : [...this.movies];
  }

  onStatusChange(movie: Movie, newStatus: string): void {
    this.movieService.updateStatus(movie.id, newStatus).subscribe({
      next: (updated) => {
        movie.status = updated.status;
        this.applyFilter();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Failed to update status.';
      }
    });
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to remove this movie?')) return;
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.movies = this.movies.filter(m => m.id !== id);
        this.applyFilter();
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Failed to delete movie.';
      }
    });
  }
}