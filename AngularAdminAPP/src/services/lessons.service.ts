import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class Lesson {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrlLesson = 'https://localhost:7249/api/Lesson';

  getLessonPermissionsSummary() {
    const token = this.authService.getToken(); // ✅ תמיד נשלף ברגע הקריאה
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ publicLessons: number; privateLessons: number }>(
      `${this.apiUrlLesson}/permissions-summary`,
      { headers }
    );
  }
}
