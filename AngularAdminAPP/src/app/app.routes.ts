import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { UsersPageComponent } from '../components/users-page/users-page.component';
import { GraphsPageComponent } from '../components/graphs-page/graphs-page.component';
import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UsersPageComponent },
    { path: 'graphs', component: GraphsPageComponent },
];
