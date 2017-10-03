import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss'],
})
export class MainTemplateComponent implements OnInit {

  UserData: object;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getUserData();
  }

  disableMenu(event){
    event.preventDefault();
  }

  getUserData(){
    this.api.getMyProfile((err, data) => {
      if(err){
        console.log(err);
      } else {
        this.UserData = data;
        console.log(this.UserData);
      }
  })
  }
  
}
