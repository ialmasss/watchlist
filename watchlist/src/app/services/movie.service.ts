import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie.interface';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMovies(status?: string): Observable<Movie[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`, { params });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}/`);
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies/`, movie);
  }

  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/movies/${id}/`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movies/${id}/`);
  }

  updateStatus(id: number, status: string): Observable<Movie> {
    return this.http.patch<Movie>(`${this.apiUrl}/movies/${id}/`, { status });
  }
}