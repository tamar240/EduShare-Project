import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrlAuth='https://localhost:7249/api/Auth';
 
  constructor(private http: HttpClient) { }

  login(Name: string, Password: string): Observable<{token: string}> {
    const body = { Name, Password };
   return this.http.post<{ token: string }>(`${this.apiUrlAuth}/login`, body);
  }

  register(Name: string ,Password: string,Email: string, RoleName: string): Observable<{ token: string}> {
    const body = {Name, Password, Email, RoleName};
    return this.http.post<{ token: string}>(`${this.apiUrlAuth}/register`, body);
  }
}

