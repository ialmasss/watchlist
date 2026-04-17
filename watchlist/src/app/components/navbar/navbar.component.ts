import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🎬</span>
        <span class="brand-text">MovieList</span>
      </div>

      @if (auth.isLoggedIn()) {
        <div class="nav-links">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/watchlist" routerLinkActive="active">My Watchlist</a>
          <a routerLink="/add-movie" routerLinkActive="active">+ Add Movie</a>
        </div>
        <div class="nav-right">
          <span class="username">👤 {{ auth.getUsername() }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      } @else {
        <div class="nav-links">
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" routerLinkActive="active">Register</a>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: #0f0f1a;
      border-bottom: 1px solid #2a2a3e;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.3rem;
      font-weight: 700;
      color: #e2b96a;
      letter-spacing: 1px;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #a0a0c0;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #e2b96a;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .username {
      color: #a0a0c0;
      font-size: 0.9rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #e2b96a;
      color: #e2b96a;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: #e2b96a;
      color: #0f0f1a;
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
      }
    });
  }
}