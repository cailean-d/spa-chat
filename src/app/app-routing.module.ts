import { DialogsComponent } from './views/dialogs/dialogs.component';
import { SettingsComponent } from './views/settings/settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules  } from '@angular/router';
import { MainTemplateComponent } from './views/main-template/main-template.component';
import { LoginMenuComponent } from './views/login-menu/login-menu.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnProfileComponent } from './views/own-profile/own-profile.component';
import { MainMenuComponent } from './views/main-menu/main-menu.component';
import { HeaderComponent } from './views/header/header.component';
import { FriendsComponent } from './views/friends/friends.component';
import { GeneralChatComponent } from './views/general-chat/general-chat.component';

const routes: Routes = [
  { path: '', component: MainTemplateComponent, pathMatch: 'full', canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    { path: '', component: OwnProfileComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
  ]},
   { path: 'login', component: MainTemplateComponent, children: [
    // { path: '', component: LoginInformationComponent, outlet: 'app-main' },
    { path: '', component: LoginMenuComponent, outlet: 'app-aside-left' }
  ]},
  { path: 'friends', component: MainTemplateComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    { path: '', component: FriendsComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
  ]},
  { path: 'general_chat', component: MainTemplateComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    { path: '', component: GeneralChatComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
  ]},
  { path: 'settings', component: MainTemplateComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    { path: '', component: SettingsComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
  ]},
  { path: 'dialogs', component: MainTemplateComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HeaderComponent, outlet: 'app-header' },
    { path: '', component: DialogsComponent, outlet: 'app-main' },
    { path: '', component: MainMenuComponent, outlet: 'app-aside-left' },
  ]},
  { path: 'pagenotfound', component: MainTemplateComponent, children: [
    { path: '', component: NotFoundComponent, outlet: 'app-main' }
  ]},
  { path: '**', redirectTo: '/pagenotfound'}  
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
