import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { UserService } from './service/services/user.service';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [() => !UserService.isLoggedIn()] // Prevent access if already logged in
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [() => !UserService.isLoggedIn()] // Prevent access if already logged in
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [() => UserService.isLoggedIn() && !UserService.isAdmin()] // Only for logged-in users
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [() => UserService.isLoggedIn() && UserService.isAdmin()] // Only for admins
  },
  {
    path: '',
    redirectTo: '/login', // Default route
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login' // Handle 404 - Page not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }