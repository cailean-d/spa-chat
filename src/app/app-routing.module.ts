import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainTemplateComponent } from './views/main-template/main-template.component';
import { LoginMenuComponent } from './views/login-menu/login-menu.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { MainMenuComponent } from './views/main-menu/main-menu.component';
import { HeaderComponent } from './views/header/header.component';

const routes: Routes = [
  { path: '', component: MainTemplateComponent, pathMatch: 'full', canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    // { path: '', component: MainProfileComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
    // { path: '', component: FooterComponent, outlet: 'app-footer' }
  ]},
   { path: 'login', component: MainTemplateComponent, pathMatch: 'full', children: [
    // { path: '', component: LoginInformationComponent, outlet: 'app-main' },
    { path: '', component: LoginMenuComponent, outlet: 'app-aside-left' }
    // { path: '', component: FooterComponent, outlet: 'app-footer' }
  ]},
  { path: 'pagenotfound', component: MainTemplateComponent, children: [
    { path: '', component: NotFoundComponent, outlet: 'app-main' }
  ]},
  { path: '**', redirectTo: '/pagenotfound'}  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
