import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent implements OnInit {

  isShowLogin: boolean = true;
  windowHash: string = window.location.hash;
  welcomeTitle: string = 'Welcome';
  loginTitle: string  = 'Registration';

  regForm: FormGroup;

  constructor(
    private title: Title,
    private AuthService: AuthService,
    private router: Router,
    private AppComponent: AppComponent,
    private FormBuilder: FormBuilder
  ) { 
    this.regForm = FormBuilder.group({
        nickname: ['',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(15)
          ]
        ],
        email: ['',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(40),
            Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          ]
        ],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30)
          ]
        ],
        password2: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30)
          ]
        ]
      },{ validator: this.checkIfMatchingPasswords('password', 'password2')})
  }

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

  disableMenu(event){
    event.preventDefault();
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

}
