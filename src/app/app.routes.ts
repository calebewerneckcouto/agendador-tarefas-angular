import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register',component: RegisterComponent},
    {path: 'login',component: LoginComponent}
];
