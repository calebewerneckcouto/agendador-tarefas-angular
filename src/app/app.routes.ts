import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { Tasks } from './pages/tasks/tasks';
import { authGuard } from './guards/auth-guard';
import { UserData } from './pages/user-data/user-data';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register',component: RegisterComponent},
    {path: 'login',component: LoginComponent},
    {path: 'tasks',component: Tasks, canActivate: [authGuard]},
    {path: 'user-data',component: UserData, canActivate: [authGuard]},
];
