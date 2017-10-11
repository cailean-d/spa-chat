import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiService } from '../../services/api.service';
declare let $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userNickName: any;
  userAvatar: any;

  constructor(
    private AppComponent: AppComponent,
    private localStorageService: LocalStorageService,
    private ApiService: ApiService
  ) { }

  ngOnInit() {
    this.getData();
  }


  getData(){
    if (!this.localStorageService.get('id')){
       this.getUserData();
    } else {
       this.setData(null);
    }
}

  getUserData(){
    if(!this.localStorageService.get('id')){
      this.ApiService.getMyProfile((err, data) => {
        if(err){
          console.log(err);
        } else {
          this.setData(data);
          this.AppComponent.setLocalStorage(data);
        }
      })
    }
  }


  setData(data){
    if(!data) data = false;
    this.userNickName = this.localStorageService.get('nickname') || data.nickname || 'unknown';
    this.userAvatar = this.localStorageService.get('avatar') || data.avatar || 'unknown';
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

  changeAvatar(){
    $('#userAvatar2').attr("src", "assets/img/avatar/" + this.userAvatar);
  }

}
