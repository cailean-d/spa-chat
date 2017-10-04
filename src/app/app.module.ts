import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { HttpModule, BrowserXhr } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

// UI modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdFormFieldModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';

// Custom modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainTemplateComponent } from './views/main-template/main-template.component';
import { LoginMenuComponent } from './views/login-menu/login-menu.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MainMenuComponent } from './views/main-menu/main-menu.component';
import { HeaderComponent } from './views/header/header.component';
import { ApiService } from './services/api.service';
import { OwnProfileComponent } from './views/own-profile/own-profile.component';
import { GeneralChatComponent } from './views/general-chat/general-chat.component';
import { DialogsComponent } from './views/dialogs/dialogs.component';
import { FriendsComponent } from './views/friends/friends.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ChatOnlineComponent } from './views/chat-online/chat-online.component';

@NgModule({
  declarations: [
    AppComponent,
    MainTemplateComponent,
    LoginMenuComponent,
    NotFoundComponent,
    MainMenuComponent,
    HeaderComponent,
    OwnProfileComponent,
    GeneralChatComponent,
    DialogsComponent,
    FriendsComponent,
    SettingsComponent,
    ChatOnlineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgProgressModule,
    HttpModule,
    Angular2FontawesomeModule,
    BrowserAnimationsModule,
    MdFormFieldModule,
    MdInputModule,
    MdButtonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard, 
    AuthService, 
    ApiService, 
    {provide: 
      BrowserXhr, 
      useClass: NgProgressBrowserXhr
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
