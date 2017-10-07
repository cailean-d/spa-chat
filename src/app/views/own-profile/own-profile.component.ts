import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from 'angular-2-local-storage';


@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.scss']
})
export class OwnProfileComponent implements OnInit {
  
  id: any;
  firstname: any;
  lastname: any;
  gender: any;
  avatar: any;
  email: any;
  password: any;
  about: any;
  birthday: any;
  phone: any;
  website: any;
  country: any;
  city: any;
  language: any;

  constructor(
    private Title : Title,
    private AppComponent: AppComponent,
    private localStorageService: LocalStorageService
  ) { 
    this.getData();
  }

  ngOnInit() {
    this.Title.setTitle('Главная');
  }


  getData(){
      if (!this.localStorageService.get('id')){
         this.AppComponent.getUserData();
         this.setData();
      } else {
         this.setData();
      }
  }

  setData(){
    this.id = this.localStorageService.get('id');
    this.firstname = this.localStorageService.get('firstname');
    this.lastname = this.localStorageService.get('lastname');
    this.gender = this.localStorageService.get('gender') || 'unknown';
    this.avatar = this.localStorageService.get('avatar');
    this.email = this.localStorageService.get('email') || 'unknown';
    this.password = this.localStorageService.get('password') || '********';
    this.about = this.localStorageService.get('about') || 'unknown';
    this.birthday = this.localStorageService.get('birthday') || 'unknown';
    this.phone = this.localStorageService.get('phone') || 'unknown';
    this.website = this.localStorageService.get('website') || 'unknown';
    this.country = this.localStorageService.get('country') || 'unknown';
    this.city = this.localStorageService.get('city') || 'unknown';
    this.language = this.localStorageService.get('language') || 'unknown';
  }

}
