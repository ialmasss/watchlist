export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  release_year: number;
  poster_url?: string;
  rating?: number;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
  created_at?: string;
  user?: number;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}