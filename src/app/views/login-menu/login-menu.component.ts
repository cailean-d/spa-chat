import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  isShowLogin: boolean = true;
  welcomeTitle: string = 'Добро пожаловать';
  loginTitle: string  = 'Регистрация';

  constructor(
    private title: Title,
    private AuthService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(this.welcomeTitle);
  }
  switchTitle(){
    if(this.isShowLogin){
      this.title.setTitle(this.welcomeTitle);
    } else {
      this.title.setTitle(this.loginTitle);
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

  register(regForm: NgForm){
    this.AuthService.regAuth(regForm.value, (err, data) => {
        if(err){
          console.log(err);
        } else {
          this.router.navigate(['/']);
        }
    })
  }
  login(loginForm: NgForm){
    this.AuthService.loginAuth(loginForm.value, (err, data) => {
        if (err){
          console.log(err);
        } else {
          this.router.navigate(['/']);
        }
    });
  }

}
