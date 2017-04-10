import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ShareComponent } from './share/share.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'share',
    component: ShareComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forRoot(routes);
