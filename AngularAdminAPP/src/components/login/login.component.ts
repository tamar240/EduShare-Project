
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  hidePassword = true;
  status: string = "login";
  showRegister: boolean = true;
rols: any;
  // rols: string[] = ["Admin"]

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      name: ['',[Validators.required]],
      email: ['', [ Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // role: [''],
    });
  }

  get formFields(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onLogin() {

    const name = this.loginForm.value.name;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const role = "Admin"
    // if (this.status == "login") {

      this.authService.login(name, password).subscribe({

        next: (res) => {

         console.log("good login",res);
         
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    // }
    // else {
    //   this.authService.register(name,  password,email, role).subscribe({
    //     next: (res) => {
    //       console.log("good register",res);
          
    //     },
    //     error: (err) => {
    //       console.error('Error:', err);
    //     }
    //   });
    // }
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.reset();
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });

  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // toRegister() {
  //   this.status = "register";
  //   this.showRegister = false;
  // }
  private handleAuthError(err: any) {
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (err.status === 400) {
      errorMessage = 'Invalid credentials. Please check your email and password.';
    } else if (err.status === 404) {
      errorMessage = 'User not found. Please check your email or register.';
    } else if (err.status === 500) {
      errorMessage = 'There is an issue with the server. Please try again later.';
    }

    alert(errorMessage);
  }
  goBack() {
    if (this.status == "register")
      this.status = "login";
    else
      window.history.back();
  }
}
