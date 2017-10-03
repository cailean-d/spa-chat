import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private AuthService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout(event){
    event.preventDefault();
    this.AuthService.logoutAuth((err, data) => {
        if(err){
          console.log(err);
        } else {
          this.router.navigate(['/login']);
        }
    })
  }

}
