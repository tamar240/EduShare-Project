import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../components/users-page/users-page.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrlUser='https://localhost:7249/api/User';
  
   constructor(private http: HttpClient,private authService:AuthService) { }
   token: string | null = null;

   ngOnInit(): void {
      this.token = this.authService.getToken();
      console.log(this.token);
      
   }
  getAllUsers(): Observable<{users: User[]}> {
   const headers = { Authorization: `Bearer ${this.token}` };
   return this.http.get<{ users: User[] }>(`${this.apiUrlUser}/admin-only`, { headers });
  }

  deleteUser(id: number): Observable<{ }> {
   const headers = { Authorization: `Bearer ${this.token}` };
   return this.http.delete<{}>(`${this.apiUrlUser}/${id}`, { headers });
  }
  getUsersPerMonth(): Observable<number[]> {
    const headers = { Authorization: `Bearer ${this.token}` };
    return this.http.get<number[]>(`${this.apiUrlUser}/per-month`, { headers });
  }
}
