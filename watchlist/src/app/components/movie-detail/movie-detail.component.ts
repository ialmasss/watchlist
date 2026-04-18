import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="detail-page">

      @if (loading) {
        <div class="loading-skeleton">
          <div class="skel-poster"></div>
          <div class="skel-info">
            <div class="skel-line wide"></div>
            <div class="skel-line medium"></div>
            <div class="skel-line narrow"></div>
          </div>
        </div>
      } @else if (errorMessage && !movie) {
        <div class="error-banner">{{ errorMessage }}</div>
      } @else if (movie) {

        <button class="back-btn" (click)="goBack()">← Back to MovieList</button>

        <div class="detail-layout">
          <div class="poster-col">
            @if (movie.poster_url) {
              <img [src]="movie.poster_url" [alt]="movie.title" class="poster-img" />
            } @else {
              <div class="poster-empty">🎬</div>
            }
          </div>

          <div class="info-col">
            @if (!editMode) {
              <span class="status-badge" [class]="'badge-' + movie.status">
                {{ statusLabel(movie.status) }}
              </span>
              <h1 class="movie-title">{{ movie.title }}</h1>
              <p class="movie-meta">{{ movie.genre }} · {{ movie.release_year }}</p>

              @if (movie.description) {
                <p class="movie-desc">{{ movie.description }}</p>
              }

              <div class="divider"></div>

              <div class="action-row">
                <button class="btn-outline" (click)="toggleEdit()">✏ Edit</button>
                <button class="btn-danger" (click)="onDelete()">Delete</button>
              </div>

            } @else {
              <h2 class="edit-title">Edit Movie</h2>

              @if (errorMessage) {
                <div class="error-banner">{{ errorMessage }}</div>
              }

              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" [(ngModel)]="editData.title" name="title" class="form-input" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Genre</label>
                  <select [(ngModel)]="editData.genre" name="genre" class="form-input">
                    @for (g of genres; track g) {
                      <option [value]="g">{{ g }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Year</label>
                  <input type="number" [(ngModel)]="editData.release_year" name="year" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select [(ngModel)]="editData.status" name="status" class="form-input">
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea [(ngModel)]="editData.description" name="desc" class="form-input" rows="3"></textarea>
              </div>
              <div class="edit-footer">
                <button class="btn-cancel-edit" (click)="toggleEdit()">Cancel</button>
                <button class="btn-save" (click)="onSave()" [disabled]="saving">
                  @if (saving) { Saving... } @else { Save Changes }
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-page {
      padding: 2rem;
      max-width: 860px;
      margin: 0 auto;
    }
    .back-btn {
      background: transparent;
      border: none;
      color: #66688a;
      cursor: pointer;
      font-size: 0.87rem;
      font-family: inherit;
      padding: 0;
      margin-bottom: 1.5rem;
      display: block;
      transition: color 0.2s;
    }
    .back-btn:hover { color: #c8a96e; }

    .detail-layout {
      display: flex;
      gap: 2.5rem;
      background: #161728;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 2rem;
    }

    .poster-col { flex-shrink: 0; width: 200px; }
    .poster-img { width: 100%; border-radius: 10px; display: block; }
    .poster-empty {
      width: 200px;
      aspect-ratio: 2/3;
      background: #1e203a;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }

    .info-col { flex: 1; min-width: 0; }

    .status-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin-bottom: 0.75rem;
    }
    .badge-watching { background: #1a3a5a; color: #60a0e0; }
    .badge-completed { background: #1a3a1a; color: #4dd47a; }
    .badge-plan_to_watch { background: #3a2a1a; color: #e0a060; }
    .badge-dropped { background: #3a1a1a; color: #e06060; }

    .movie-title {
      font-size: 1.7rem;
      font-weight: 700;
      color: #f0f0ff;
      margin-bottom: 0.4rem;
      line-height: 1.2;
    }
    .movie-meta { color: #66688a; font-size: 0.9rem; margin-bottom: 1rem; }
    .movie-desc { color: #a0a0c0; font-size: 0.9rem; line-height: 1.65; }

    .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 1.5rem 0; }

    .action-row { display: flex; gap: 0.75rem; }
    .btn-outline {
      padding: 0.55rem 1.2rem;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #a0a0c0;
      font-family: inherit;
      font-size: 0.87rem;
      cursor: pointer;
      transition: all 0.18s;
    }
    .btn-outline:hover { border-color: #c8a96e; color: #c8a96e; }
    .btn-danger {
      padding: 0.55rem 1.2rem;
      background: transparent;
      border: 1px solid rgba(220,80,80,0.3);
      border-radius: 8px;
      color: #e06060;
      font-family: inherit;
      font-size: 0.87rem;
      cursor: pointer;
      transition: background 0.18s;
    }
    .btn-danger:hover { background: rgba(220,80,80,0.08); }

    .edit-title { color: #f0f0ff; font-size: 1.1rem; font-weight: 600; margin-bottom: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    .form-group { margin-bottom: 1rem; }
    .form-label {
      display: block;
      color: #66688a;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.35rem;
    }
    .form-input {
      width: 100%;
      padding: 0.65rem 0.9rem;
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
    textarea.form-input { resize: vertical; }

    .edit-footer {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-cancel-edit {
      padding: 0.6rem 1.2rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #66688a;
      background: transparent;
      font-family: inherit;
      font-size: 0.87rem;
      cursor: pointer;
      transition: all 0.18s;
    }
    .btn-cancel-edit:hover { border-color: rgba(255,255,255,0.2); color: #a0a0c0; }
    .btn-save {
      padding: 0.6rem 1.4rem;
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
    .btn-save:hover:not(:disabled) { background: #dfc08a; }
    .btn-save:disabled { opacity: 0.55; cursor: not-allowed; }

    .loading-skeleton { display: flex; gap: 2rem; padding: 2rem; background: #161728; border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); }
    .skel-poster { width: 200px; aspect-ratio: 2/3; background: #1e203a; border-radius: 10px; animation: pulse 1.5s infinite; flex-shrink: 0; }
    .skel-info { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.5rem; }
    .skel-line { background: #1e203a; border-radius: 6px; height: 20px; animation: pulse 1.5s infinite; }
    .skel-line.wide { width: 80%; }
    .skel-line.medium { width: 50%; }
    .skel-line.narrow { width: 30%; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    .error-banner {
      background: rgba(220,60,60,0.08);
      border: 1px solid rgba(220,60,60,0.25);
      color: #e06060;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 600px) {
      .detail-layout { flex-direction: column; }
      .poster-col { width: 100%; }
      .poster-empty { width: 100%; }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  editData: Partial<Movie> = {};
  editMode = false;
  loading = true;
  saving = false;
  errorMessage = '';

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy', 'Mystery', 'Adventure'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(id).subscribe({
      next: (data) => { this.movie = data; this.loading = false; },
      error: (err) => { this.loading = false; this.errorMessage = err.error?.detail || 'Movie not found.'; }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.errorMessage = '';
    if (this.editMode && this.movie) this.editData = { ...this.movie };
  }

  onSave(): void {
    if (!this.movie) return;
    this.saving = true;
    this.movieService.updateMovie(this.movie.id, this.editData).subscribe({
      next: (updated) => { this.movie = updated; this.editMode = false; this.saving = false; },
      error: (err) => { this.saving = false; this.errorMessage = err.error?.detail || 'Failed to update movie.'; }
    });
  }

  onDelete(): void {
    if (!this.movie || !confirm('Delete this movie from your MovieList?')) return;
    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => this.router.navigate(['/watchlist']),
      error: (err) => { this.errorMessage = err.error?.detail || 'Failed to delete.'; }
    });
  }

  goBack(): void {
    this.router.navigate(['/watchlist']);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      watching: 'Watching', completed: 'Completed',
      plan_to_watch: 'Plan to Watch', dropped: 'Dropped'
    };
    return map[status] || status;
  }
}