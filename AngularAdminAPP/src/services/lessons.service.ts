import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Lesson {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private baseUrl = environment.apiUrl;

  private apiUrlLesson = `${this.baseUrl}/Lesson`;

  getLessonPermissionsSummary() {
    const token = this.authService.getToken(); // ✅ תמיד נשלף ברגע הקריאה
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ publicLessons: number; privateLessons: number }>(
      `${this.apiUrlLesson}/permissions-summary`,
      { headers }
    );
  }
}
