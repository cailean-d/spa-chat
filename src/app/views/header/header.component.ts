import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
declare let jquery:any;
declare let $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userFirstName: string;
  userLastName: string;
  userFullName: string;

  constructor(
    private AppComponent: AppComponent
  ) { }

  ngOnInit() {
    this.userFirstName = this.AppComponent.UserData.firstname;
    this.userLastName = this.AppComponent.UserData.lastname;
    this.UserFullName();
  }

  UserFullName(){
    this.userFullName = this.userFirstName + ' ' + this.userLastName;
  }

  toggleStatusList(list){
    $(list).slideToggle(200);
  }

  toggleLangList(list){
    $(list).slideToggle(200);
  }
 
  closeStatusList(list){
    $(list).slideUp(300);
  }

  closeLangList(list){
    $(list).slideUp(300);
  }

}
