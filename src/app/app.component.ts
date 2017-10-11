import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-root',
  template: `<p-growl [(value)]="msgs"></p-growl>
            <ng-progress 
            [positionUsing]="'marginLeft'" 
            [minimum]="0.08" 
            [maximum]="1"
            [speed]="200" 
            [showSpinner]="false" 
            [direction]="'leftToRightIncreased'"
            [color]="'#29d'" 
            [trickleSpeed]="250" 
            [thick]="true" 
            [ease]="'linear'"
            ></ng-progress>
            <router-outlet></router-outlet>
            `,
  providers: [MessageService]
})
export class AppComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private ApiService: ApiService,
    private localStorageService: LocalStorageService,
    private messageService: MessageService
  ) {}

  ngOnInit() {

    if(window.location.pathname != '/login' && window.location.pathname != '/404'){
      this.getUserData();
    }

    return this.AuthService.checkAuth((err, res) => {
      if (err) {
        this.removeLocalStorage();
      } else {
        this.getUserData();
      }
   });
  }

  getUserData(){
    if(!this.localStorageService.get('id')){
      this.ApiService.getMyProfile((err, data) => {
        if(err){
          console.log(err);
        } else {
          this.setLocalStorage(data);
        }
      })
    }
  }

  setLocalStorage(data): void{
    this.localStorageService.set('id',data.id);
    this.localStorageService.set('nickname',data.nickname);
    this.localStorageService.set('firstname', data.firstname);
    this.localStorageService.set('lastname', data.lastname);
    this.localStorageService.set('avatar', data.avatar);
    this.localStorageService.set('gender', data.gender);
    this.localStorageService.set('about', data.about);
    this.localStorageService.set('birthday', data.birthday);
    this.localStorageService.set('phone', data.phone);
    this.localStorageService.set('website', data.website);
    this.localStorageService.set('country', data.country);
    this.localStorageService.set('city', data.city);
    this.localStorageService.set('language', data.language);
    this.localStorageService.set('registration', data.date);
    this.localStorageService.set('email', data.email);
  }

  removeLocalStorage(): void{
    this.localStorageService.remove('id');
    this.localStorageService.remove('nickname');
    this.localStorageService.remove('firstname');
    this.localStorageService.remove('lastname');
    this.localStorageService.remove('avatar');
    this.localStorageService.remove('gender');
    this.localStorageService.remove('about');
    this.localStorageService.remove('birthday');
    this.localStorageService.remove('phone');
    this.localStorageService.remove('website');
    this.localStorageService.remove('country');
    this.localStorageService.remove('city');
    this.localStorageService.remove('language');
    this.localStorageService.remove('registration');
    this.localStorageService.remove('email');
  }

  updateLocalStorage(key, value):void{
    this.localStorageService.set(key, value);
  }


  msgs: Message[] = [];
  
  showSuccess(msg) {
      this.msgs = [];
      this.msgs.push({severity:'success', summary:'Success', detail: msg});
  }

  showInfo(msg) {
      this.msgs = [];
      this.msgs.push({severity:'info', summary:'Info', detail: msg});
  }

  showWarn(msg) {
      this.msgs = [];
      this.msgs.push({severity:'warn', summary:'Warn', detail: msg});
  }

  showError(msg) {
      this.msgs = [];
      this.msgs.push({severity:'error', summary:'Error', detail: msg});
  }

  clear() {
      this.msgs = [];
  }
}
