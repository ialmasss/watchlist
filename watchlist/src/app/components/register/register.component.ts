import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/movie.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">🎬</span>
          <h1>Create Account</h1>
          <p>Join MovieList and track your movies</p>
        </div>

        @if (errorMessage) {
          <div class="error-banner">{{ errorMessage }}</div>
        }
        @if (successMessage) {
          <div class="success-banner">{{ successMessage }}</div>
        }

        <div class="form-group">
          <label>Username</label>
          <!-- ngModel #3 -->
          <input
            type="text"
            [(ngModel)]="registerData.username"
            name="username"
            placeholder="Choose a username"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <!-- ngModel #4 -->
          <input
            type="email"
            [(ngModel)]="registerData.email"
            name="email"
            placeholder="Enter your email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="registerData.password"
            name="password"
            placeholder="Create a password"
            class="form-input"
          />
        </div>

        <!-- click event #2 -->
        <button class="btn-primary" (click)="onRegister()" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="auth-link">Already have an account? <a routerLink="/login">Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: #0a0a14;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .auth-card {
      background: #0f0f1a;
      border: 1px solid #2a2a3e;
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
    h1 { color: #f0f0ff; font-size: 1.6rem; margin: 0 0 0.3rem; }
    p { color: #6060a0; font-size: 0.9rem; margin: 0; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; color: #a0a0c0; font-size: 0.85rem; margin-bottom: 0.4rem; }
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #1a1a2e;
      border: 1px solid #2a2a3e;
      border-radius: 8px;
      color: #f0f0ff;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .form-input:focus { outline: none; border-color: #e2b96a; }
    .btn-primary {
      width: 100%;
      padding: 0.85rem;
      background: #e2b96a;
      color: #0f0f1a;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) { background: #f0c97a; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-banner {
      background: #2a1a1a; border: 1px solid #c0404040;
      color: #e06060; padding: 0.75rem 1rem;
      border-radius: 8px; margin-bottom: 1.2rem; font-size: 0.9rem;
    }
    .success-banner {
      background: #1a2a1a; border: 1px solid #40c04040;
      color: #60e060; padding: 0.75rem 1rem;
      border-radius: 8px; margin-bottom: 1.2rem; font-size: 0.9rem;
    }
    .auth-link { text-align: center; color: #6060a0; font-size: 0.9rem; margin-top: 1.2rem; }
    .auth-link a { color: #e2b96a; text-decoration: none; }
  `]
})
export class RegisterComponent {
  registerData: RegisterData = { username: '', email: '', password: '' };
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister(): void {
    this.errorMessage = '';
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.auth.register(this.registerData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loading = false;
        const errors = err.error;
        if (typeof errors === 'object') {
          const msgs = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join(', ');
          this.errorMessage = msgs;
        } else {
          this.errorMessage = errors?.detail || 'Registration failed.';
        }
      }
    });
  }
}