import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  isShowLogin: boolean = true;
  
  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Добро пожаловать');
  }
  switchTitle(){
    if(this.isShowLogin){
      this.titleService.setTitle('Добро пожаловать');
    } else {
      this.titleService.setTitle('Регистрация');
    }
  }
  showLogin():void{
    this.isShowLogin = true;
    this.switchTitle();
  }

  showReg(): void{
    this.isShowLogin = false;
    this.switchTitle();
  }

  reg(event){
    event.preventDefault();
  }

}
