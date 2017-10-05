import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';
import { AuthService } from './services/auth.service';

interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
}

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

  isLogined: boolean;
  UserData: UserData;
  DataIsReceived:boolean;

  constructor(
    private AuthService: AuthService,
    private ApiService: ApiService,
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
    this.ApiService.getMyProfile((err, data) => {
      if(err){
        console.log(err);
      } else {
        this.UserData = data;
        this.DataIsReceived = true;
      }
    })
  }
}
