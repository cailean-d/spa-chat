import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  homeClass: string;

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private AppComponent: AppComponent
  ) { }

  ngOnInit() {
    if(this.router.url == '/'){
      this.homeClass = 'active';
    } else {
      this.homeClass = '';
    }
  }

  logout(event){
    event.preventDefault();
    this.AuthService.logoutAuth((err, data) => {
        if(err){
          console.log(err);
        } else {
          this.AppComponent.DataIsReceived = false;
          this.router.navigate(['/login']);
        }
    })
  }

}
