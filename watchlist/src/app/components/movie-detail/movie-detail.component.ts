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
        <div class="loading">Loading...</div>
      } @else if (errorMessage && !movie) {
        <div class="error-banner">{{ errorMessage }}</div>
      } @else if (movie) {
        <div class="detail-card">
          <button class="btn-back" (click)="goBack()">← Back</button>

          <div class="detail-layout">
            <div class="poster-section">
              @if (movie.poster_url) {
                <img [src]="movie.poster_url" [alt]="movie.title" class="poster-img" />
              } @else {
                <div class="poster-placeholder">🎬</div>
              }
            </div>

            <div class="info-section">
              @if (!editMode) {
                <div class="view-mode">
                  <span class="status-badge" [class]="'status-' + movie.status">{{ formatStatus(movie.status) }}</span>
                  <h1>{{ movie.title }}</h1>
                  <p class="meta">{{ movie.genre }} · {{ movie.release_year }}</p>
                  @if (movie.description) {
                    <p class="description">{{ movie.description }}</p>
                  }
                  <div class="actions">
                    <!-- click event: toggle edit -->
                    <button class="btn-edit" (click)="toggleEdit()">✏️ Edit</button>
                    <!-- click event: delete from detail -->
                    <button class="btn-delete" (click)="onDelete()">🗑 Delete</button>
                  </div>
                </div>
              } @else {
                <div class="edit-mode">
                  <h2>Edit Movie</h2>

                  @if (errorMessage) {
                    <div class="error-banner">{{ errorMessage }}</div>
                  }

                  <div class="form-group">
                    <label>Title</label>
                    <input type="text" [(ngModel)]="editData.title" name="title" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Genre</label>
                    <select [(ngModel)]="editData.genre" name="genre" class="form-input">
                      @for (g of genres; track g) {
                        <option [value]="g">{{ g }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Release Year</label>
                    <input type="number" [(ngModel)]="editData.release_year" name="year" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Status</label>
                    <select [(ngModel)]="editData.status" name="status" class="form-input">
                      <option value="plan_to_watch">Plan to Watch</option>
                      <option value="watching">Watching</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Description</label>
                    <textarea [(ngModel)]="editData.description" name="desc" class="form-input textarea" rows="3"></textarea>
                  </div>
                  <div class="edit-actions">
                    <button class="btn-cancel" (click)="toggleEdit()">Cancel</button>
                    <!-- click event: save -->
                    <button class="btn-save" (click)="onSave()" [disabled]="saving">
                      {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-page { padding: 2rem; max-width: 900px; margin: 0 auto; background: #0a0a14; min-height: 100vh; }
    .detail-card { background: #0f0f1a; border: 1px solid #2a2a3e; border-radius: 16px; padding: 2rem; }
    .btn-back { background: transparent; border: none; color: #a0a0c0; cursor: pointer; font-size: 0.9rem; margin-bottom: 1.5rem; display: block; padding: 0; transition: color 0.2s; }
    .btn-back:hover { color: #e2b96a; }
    .detail-layout { display: flex; gap: 2rem; }
    .poster-section { flex-shrink: 0; width: 200px; }
    .poster-img { width: 100%; border-radius: 10px; }
    .poster-placeholder { width: 200px; height: 280px; background: #1a1a2e; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
    .info-section { flex: 1; }
    .status-badge { font-size: 0.75rem; padding: 0.3rem 0.75rem; border-radius: 20px; font-weight: 600; display: inline-block; margin-bottom: 0.75rem; }
    .status-watching { background: #1a3a5a; color: #60a0e0; }
    .status-completed { background: #1a3a1a; color: #60e060; }
    .status-plan_to_watch { background: #3a2a1a; color: #e0a060; }
    .status-dropped { background: #3a1a1a; color: #e06060; }
    h1 { color: #f0f0ff; margin: 0 0 0.5rem; font-size: 1.6rem; }
    .meta { color: #6060a0; margin: 0 0 1rem; }
    .description { color: #a0a0c0; line-height: 1.6; }
    .actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
    .btn-edit { padding: 0.6rem 1.2rem; border: 1px solid #2a2a3e; color: #a0a0c0; background: transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .btn-edit:hover { border-color: #e2b96a; color: #e2b96a; }
    .btn-delete { padding: 0.6rem 1.2rem; border: 1px solid #c0404040; color: #e06060; background: transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .btn-delete:hover { background: #2a1a1a; }
    .edit-mode h2 { color: #f0f0ff; margin: 0 0 1.2rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; color: #a0a0c0; font-size: 0.85rem; margin-bottom: 0.3rem; }
    .form-input { width: 100%; padding: 0.65rem 0.9rem; background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 8px; color: #f0f0ff; font-size: 0.9rem; box-sizing: border-box; font-family: inherit; }
    .form-input:focus { outline: none; border-color: #e2b96a; }
    .textarea { resize: vertical; }
    .edit-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.6rem 1.2rem; border: 1px solid #2a2a3e; color: #a0a0c0; background: transparent; border-radius: 8px; cursor: pointer; }
    .btn-save { padding: 0.6rem 1.2rem; background: #e2b96a; color: #0f0f1a; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
    .btn-save:hover:not(:disabled) { background: #f0c97a; }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .loading { color: #6060a0; text-align: center; padding: 3rem; }
    .error-banner { background: #2a1a1a; border: 1px solid #c0404040; color: #e06060; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  editData: Partial<Movie> = {};
  editMode = false;
  loading = true;
  saving = false;
  errorMessage = '';
  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy'];

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
    if (this.editMode && this.movie) {
      this.editData = { ...this.movie };
    }
  }

  onSave(): void {
    if (!this.movie) return;
    this.saving = true;
    this.movieService.updateMovie(this.movie.id, this.editData).subscribe({
      next: (updated) => {
        this.movie = updated;
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.detail || 'Failed to update movie.';
      }
    });
  }

  onDelete(): void {
    if (!this.movie || !confirm('Delete this movie?')) return;
    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => this.router.navigate(['/watchlist']),
      error: (err) => { this.errorMessage = err.error?.detail || 'Failed to delete.'; }
    });
  }

  goBack(): void {
    this.router.navigate(['/watchlist']);
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      watching: 'Watching', completed: 'Completed',
      plan_to_watch: 'Plan to Watch', dropped: 'Dropped'
    };
    return map[status] || status;
  }
}