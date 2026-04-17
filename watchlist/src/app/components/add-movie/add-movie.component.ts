import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="add-page">
      <div class="form-card">
        <div class="form-header">
          <h1>Add a Movie</h1>
          <p>Add a movie to your watchlist</p>
        </div>

        @if (errorMessage) {
          <div class="error-banner">{{ errorMessage }}</div>
        }
        @if (successMessage) {
          <div class="success-banner">✅ {{ successMessage }}</div>
        }

        <div class="form-row">
          <div class="form-group">
            <label>Title *</label>
            <!-- ngModel #1 (global) -->
            <input type="text" [(ngModel)]="movie.title" name="title" placeholder="Movie title" class="form-input" />
          </div>
          <div class="form-group">
            <label>Release Year</label>
            <!-- ngModel #2 (global) -->
            <input type="number" [(ngModel)]="movie.release_year" name="release_year" placeholder="2024" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Genre</label>
            <!-- ngModel #3 (global) -->
            <select [(ngModel)]="movie.genre" name="genre" class="form-input">
              <option value="">Select genre</option>
              @for (g of genres; track g) {
                <option [value]="g">{{ g }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <!-- ngModel #4 (global) -->
            <select [(ngModel)]="movie.status" name="status" class="form-input">
              <option value="plan_to_watch">Plan to Watch</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Poster URL</label>
          <input type="url" [(ngModel)]="movie.poster_url" name="poster_url" placeholder="https://..." class="form-input" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="movie.description" name="description" placeholder="Brief description..." class="form-input textarea" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <a routerLink="/watchlist" class="btn-cancel">Cancel</a>
          <!-- click event: submit -->
          <button class="btn-primary" (click)="onSubmit()" [disabled]="loading">
            {{ loading ? 'Adding...' : 'Add to Watchlist' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-page { padding: 2rem; max-width: 700px; margin: 0 auto; background: #0a0a14; min-height: 100vh; }
    .form-card { background: #0f0f1a; border: 1px solid #2a2a3e; border-radius: 16px; padding: 2rem; }
    .form-header { margin-bottom: 1.5rem; }
    h1 { color: #f0f0ff; margin: 0 0 0.3rem; }
    p { color: #6060a0; font-size: 0.9rem; margin: 0; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; color: #a0a0c0; font-size: 0.85rem; margin-bottom: 0.4rem; }
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #1a1a2e; border: 1px solid #2a2a3e;
      border-radius: 8px; color: #f0f0ff;
      font-size: 0.95rem; box-sizing: border-box;
      transition: border-color 0.2s; font-family: inherit;
    }
    .form-input:focus { outline: none; border-color: #e2b96a; }
    .textarea { resize: vertical; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      border: 1px solid #2a2a3e; color: #a0a0c0;
      border-radius: 8px; text-decoration: none; font-size: 0.95rem;
      transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: #6060a0; }
    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #e2b96a; color: #0f0f1a;
      border: none; border-radius: 8px;
      font-size: 0.95rem; font-weight: 700; cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) { background: #f0c97a; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-banner { background: #2a1a1a; border: 1px solid #c0404040; color: #e06060; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; }
    .success-banner { background: #1a2a1a; border: 1px solid #40c04040; color: #60e060; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; }
  `]
})
export class AddMovieComponent {
  movie: Partial<Movie> = {
    title: '',
    description: '',
    genre: '',
    release_year: new Date().getFullYear(),
    poster_url: '',
    status: 'plan_to_watch'
  };

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy'];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private movieService: MovieService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.movie.title?.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }
    this.loading = true;
    this.movieService.createMovie(this.movie).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Movie added successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/watchlist']), 1500);
      },
      error: (err) => {
        this.loading = false;
        if (err.error && typeof err.error === 'object') {
          const msgs = Object.entries(err.error).map(([k, v]) => `${k}: ${v}`).join(', ');
          this.errorMessage = msgs;
        } else {
          this.errorMessage = err.error?.detail || 'Failed to add movie.';
        }
      }
    });
  }
}