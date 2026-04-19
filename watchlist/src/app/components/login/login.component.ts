import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginData } from '../../models/movie.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg-glow"></div>

      <div class="auth-card">
        <div class="auth-brand">
          <div class="brand-dot"></div>
          MovieList
        </div>

        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Sign in to continue tracking your movies</p>

        @if (errorMessage) {
          <div class="error-banner">{{ errorMessage }}</div>
        }

        <div class="form-group">
          <label class="form-label">Username</label>
          <input
            type="text"
            [(ngModel)]="loginData.username"
            name="username"
            placeholder="your_username"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            type="password"
            [(ngModel)]="loginData.password"
            name="password"
            placeholder="••••••••"
            class="form-input"
            (keydown.enter)="onLogin()"
          />
        </div>

        <button class="btn-gold full-width" (click)="onLogin()" [disabled]="loading">
          @if (loading) { Signing in... } @else { Sign In }
        </button>

        <p class="auth-footer">
          Don't have an account?
          <a routerLink="/register">Create one</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: #0b0c14;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .auth-bg-glow {
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(200,169,110,0.07) 0%, transparent 70%);
      pointer-events: none;
    }
    .auth-card {
      background: #0f1020;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      position: relative;
      z-index: 1;
    }
    .auth-brand {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: #c8a96e;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1.75rem;
    }
    .brand-dot {
      width: 8px;
      height: 8px;
      background: #c8a96e;
      border-radius: 50%;
    }
    .auth-title {
      color: #f0f0ff;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    .auth-subtitle {
      color: #66688a;
      font-size: 0.88rem;
      margin-bottom: 1.75rem;
    }
    .form-group { margin-bottom: 1.1rem; }
    .form-label {
      display: block;
      color: #66688a;
      font-size: 0.77rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
    }
    .form-input {
      width: 100%;
      padding: 0.72rem 1rem;
      background: #161728;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #f0f0ff;
      font-family: inherit;
      font-size: 0.9rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #c8a96e;
      box-shadow: 0 0 0 3px rgba(200,169,110,0.1);
    }
    .form-input::placeholder { color: #44446a; }
    .btn-gold {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background: #c8a96e;
      color: #0b0c14;
      border: none;
      border-radius: 9px;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      margin-top: 0.5rem;
    }
    .btn-gold.full-width { width: 100%; }
    .btn-gold:hover { background: #dfc08a; }
    .btn-gold:active { transform: scale(0.99); }
    .btn-gold:disabled { opacity: 0.55; cursor: not-allowed; }
    .error-banner {
      background: rgba(220,60,60,0.08);
      border: 1px solid rgba(220,60,60,0.25);
      color: #e06060;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font-size: 0.87rem;
      margin-bottom: 1.2rem;
    }
    .auth-footer {
      text-align: center;
      color: #44446a;
      font-size: 0.87rem;
      margin-top: 1.25rem;
    }
    .auth-footer a {
      color: #c8a96e;
      text-decoration: none;
      font-weight: 500;
    }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  loginData: LoginData = { username: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.auth.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}