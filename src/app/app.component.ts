import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-root',
  template: `
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
            `
})
export class AppComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private ApiService: ApiService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {

    if(window.location.pathname != '/login'){
      this.getUserData();
    }

    return this.AuthService.checkAuth((err, res) => {
      if (err) {
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
    this.localStorageService.set('firstname', data.firstname);
    this.localStorageService.set('lastname', data.lastname);
    this.localStorageService.set('avatar',data.avatar);
    this.localStorageService.set('gender', data.gender);
  }

  removeLocalStorage(): void{
    this.localStorageService.remove('id');
    this.localStorageService.remove('firstname');
    this.localStorageService.remove('lastname');
    this.localStorageService.remove('avatar');
    this.localStorageService.remove('gender');
  }
}
