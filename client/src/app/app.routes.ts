import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    component: CalendarComponent,
  },
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
