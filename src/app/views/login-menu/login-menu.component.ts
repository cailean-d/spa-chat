import { AppComponent } from '../../app.component';
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
  windowHash: string = window.location.hash;
  welcomeTitle: string = 'Welcome';
  loginTitle: string  = 'Registration';

  constructor(
    private title: Title,
    private AuthService: AuthService,
    private router: Router,
    private AppComponent: AppComponent
  ) { }

  ngOnInit() {
    this.title.setTitle(this.welcomeTitle);
    if(this.windowHash) this.isShowLogin = false;
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
    window.location.hash = '';
  }

  showReg(): void{
    this.isShowLogin = false;
    this.switchTitle();
    window.location.hash = 'reg';
  }

  register(regForm: NgForm){
    this.AuthService.regAuth(regForm.value, (err, data) => {
        if(err){
          let errObj = JSON.parse(err);
          this.AppComponent.showError(errObj.message);
        } else {
          this.AppComponent.getUserData();
          this.router.navigate(['/']);
        }
    })
  }
  login(loginForm: NgForm){
    this.AuthService.loginAuth(loginForm.value, (err, data) => {
        if (err){
          let errObj = JSON.parse(err);
          this.AppComponent.showError(errObj.message);
        } else {
          this.AppComponent.getUserData();
          this.router.navigate(['/']);
        }
    });
  }

}
