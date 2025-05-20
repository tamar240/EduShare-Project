import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = environment.apiUrl;
  private apiUrlAuth = `${this.baseUrl}/Auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getToken()!= null);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(Name: string, Password: string): Observable<{ token: string }> {
    const body = { Name, Password };
    return this.http.post<{ token: string }>(`${this.apiUrlAuth}/login`, body).pipe(
      tap(response => {
        this.cookieService.set('authToken', response.token);
        this.isLoggedInSubject.next(true);

      })
    );
  }

 

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }
  logout(): void {
    this.cookieService.delete('authToken');
    this.isLoggedInSubject.next(false);
  }
}

