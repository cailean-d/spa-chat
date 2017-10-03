import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss'],
})
export class MainTemplateComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }

  disableMenu(event){
    event.preventDefault();
  }
  
}
