import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlAuth = 'https://localhost:7249/api/Auth';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(Name: string, Password: string): Observable<{ token: string }> {
    const body = { Name, Password };
    return this.http.post<{ token: string }>(`${this.apiUrlAuth}/login`, body).pipe(
      tap(response => {
        this.cookieService.set('authToken', response.token);
      })
    );
  }

  register(Name: string, Password: string, Email: string, RoleName: string): Observable<{ token: string }> {
    const body = { Name, Password, Email, RoleName };
    return this.http.post<{ token: string }>(`${this.apiUrlAuth}/register`, body).pipe(
      tap(response => {
        this.cookieService.set('authToken', response.token);
      })
    );
  }

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }
}

