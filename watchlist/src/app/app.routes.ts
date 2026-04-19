import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./components/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'add-movie',
    loadComponent: () => import('./components/add-movie/add-movie.component').then(m => m.AddMovieComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { path: '**', redirectTo: '/home' }
];