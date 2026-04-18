import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand" routerLink="/home">
        <div class="brand-dot"></div>
        <span>MovieList</span>
      </div>

      @if (auth.isLoggedIn()) {
        <div class="nav-links">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/watchlist" routerLinkActive="active">Watchlist</a>
          <a routerLink="/add-movie" routerLinkActive="active">+ Add Movie</a>
        </div>
        <div class="nav-right">
          <span class="nav-user">
            <span class="user-dot"></span>
            {{ auth.getUsername() }}
          </span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      } @else {
        <div class="nav-links">
          <a routerLink="/login" routerLinkActive="active">Sign In</a>
          <a routerLink="/register" routerLinkActive="active" class="register-pill">Get Started</a>
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
      height: 60px;
      background: #0f1020;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: #c8a96e;
      cursor: pointer;
    }
    .brand-dot {
      width: 8px;
      height: 8px;
      background: #c8a96e;
      border-radius: 50%;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }
    .nav-links a {
      color: #66688a;
      text-decoration: none;
      font-size: 0.87rem;
      font-weight: 500;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
    }
    .nav-links a:hover {
      color: #f0f0ff;
      background: rgba(255,255,255,0.05);
    }
    .nav-links a.active {
      color: #c8a96e;
      background: rgba(200,169,110,0.1);
    }
    .register-pill {
      background: rgba(200,169,110,0.12) !important;
      border: 1px solid rgba(200,169,110,0.3) !important;
      color: #c8a96e !important;
      margin-left: 0.4rem;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #66688a;
      font-size: 0.83rem;
    }
    .user-dot {
      width: 6px;
      height: 6px;
      background: #4dd47a;
      border-radius: 50%;
    }
    .logout-btn {
      background: transparent;
      border: 1px solid rgba(200,169,110,0.3);
      color: #c8a96e;
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.82rem;
      font-family: inherit;
      transition: background 0.2s;
    }
    .logout-btn:hover {
      background: rgba(200,169,110,0.1);
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