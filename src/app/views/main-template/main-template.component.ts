import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss'],
})
export class MainTemplateComponent implements OnInit {


  constructor(
  private ApiService: ApiService,
  private AuthService: AuthService,
  private AppComponent: AppComponent
) {}

  ngOnInit() {
    if(this.AuthService.isAuth){
      this.AppComponent.getUserData();
    }
  }

  disableMenu(event){
    event.preventDefault();
  }
  
}
