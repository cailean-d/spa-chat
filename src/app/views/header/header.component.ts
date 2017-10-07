import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
declare let jquery:any;
declare let $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userFirstName: any;
  userLastName: any;
  userFullName: any;
  userAvatar: any;

  constructor(
    private AppComponent: AppComponent,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.getData();
  }

  UserFullName(){
    this.userFullName = this.userFirstName + ' ' + this.userLastName;
  }

  getData(){
    if (!this.localStorageService.get('id')){
       this.AppComponent.getUserData();
       this.setData();
       this.UserFullName();
    } else {
       this.setData();
       this.UserFullName();
    }
}


  setData(){
    this.userFirstName = this.localStorageService.get('firstname');
    this.userLastName = this.localStorageService.get('lastname');
    this.userAvatar = this.localStorageService.get('avatar');
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
