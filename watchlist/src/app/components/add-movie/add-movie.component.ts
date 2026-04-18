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
      <div class="add-header">
        <a routerLink="/watchlist" class="back-link">← MovieList</a>
        <h1>Add a Movie</h1>
        <p>Add a new entry to your MovieList</p>
      </div>

      <div class="form-card">
        @if (errorMessage) {
          <div class="error-banner">{{ errorMessage }}</div>
        }
        @if (successMessage) {
          <div class="success-banner">{{ successMessage }}</div>
        }

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" [(ngModel)]="movie.title" name="title" placeholder="e.g. Dune: Part Two" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Release Year</label>
            <input type="number" [(ngModel)]="movie.release_year" name="year" placeholder="2025" class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Genre</label>
            <select [(ngModel)]="movie.genre" name="genre" class="form-input">
              <option value="">Select a genre</option>
              @for (g of genres; track g) {
                <option [value]="g">{{ g }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select [(ngModel)]="movie.status" name="status" class="form-input">
              <option value="plan_to_watch">Plan to Watch</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Poster URL</label>
          <input type="url" [(ngModel)]="movie.poster_url" name="poster" placeholder="https://image.tmdb.org/..." class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea [(ngModel)]="movie.description" name="desc" placeholder="Brief description of the movie..." class="form-input" rows="3"></textarea>
        </div>

        <div class="form-footer">
          <a routerLink="/watchlist" class="btn-cancel">Cancel</a>
          <button class="btn-submit" (click)="onSubmit()" [disabled]="loading">
            @if (loading) { Adding... } @else { Add to MovieList }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-page {
      padding: 2rem;
      max-width: 680px;
      margin: 0 auto;
    }
    .add-header { margin-bottom: 1.5rem; }
    .back-link {
      color: #66688a;
      text-decoration: none;
      font-size: 0.85rem;
      display: inline-block;
      margin-bottom: 0.75rem;
      transition: color 0.2s;
    }
    .back-link:hover { color: #c8a96e; }
    h1 { font-size: 1.4rem; font-weight: 700; color: #f0f0ff; margin-bottom: 0.25rem; }
    p { color: #66688a; font-size: 0.87rem; }
    .form-card {
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      padding: 1.75rem;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.1rem; }
    .form-label {
      display: block;
      color: #66688a;
      font-size: 0.76rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.38rem;
    }
    .form-input {
      width: 100%;
      padding: 0.7rem 0.95rem;
      background: #0f1020;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #f0f0ff;
      font-family: inherit;
      font-size: 0.88rem;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #c8a96e;
      box-shadow: 0 0 0 3px rgba(200,169,110,0.1);
    }
    .form-input::placeholder { color: #44446a; }
    textarea.form-input { resize: vertical; }
    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-cancel {
      padding: 0.65rem 1.3rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #66688a;
      text-decoration: none;
      font-size: 0.88rem;
      transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #a0a0c0; }
    .btn-submit {
      padding: 0.65rem 1.6rem;
      background: #c8a96e;
      color: #0b0c14;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #dfc08a; }
    .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    .error-banner {
      background: rgba(220,60,60,0.08);
      border: 1px solid rgba(220,60,60,0.25);
      color: #e06060;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.2rem;
    }
    .success-banner {
      background: rgba(60,200,100,0.08);
      border: 1px solid rgba(60,200,100,0.25);
      color: #4dd47a;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.2rem;
    }
    @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
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

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy', 'Mystery', 'Adventure'];
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
        this.successMessage = '🎬 Movie added successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/watchlist']), 1400);
      },
      error: (err) => {
        this.loading = false;
        const errorData = err.error;
        if (errorData && typeof errorData === 'object') {
          this.errorMessage = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' · ');
        } else {
          this.errorMessage = errorData?.detail || 'Failed to add movie.';
        }
      }
    });
  }
}