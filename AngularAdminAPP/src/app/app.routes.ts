import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { UsersPageComponent } from '../components/users-page/users-page.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'users', component: UsersPageComponent }
];
