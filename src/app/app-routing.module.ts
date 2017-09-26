import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template/main-template.component';
import { LoginMenuComponent } from './login-menu/login-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: MainTemplateComponent, pathMatch: 'full'/* , canActivate: [LoginService] */, children: [
    // { path: '', component: HeaderComponent, outlet: 'app-header' },
    // { path: '', component: MainProfileComponent, outlet: 'app-main' },
    // { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
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
