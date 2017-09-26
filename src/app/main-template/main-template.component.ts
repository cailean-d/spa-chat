import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  disableMenu(event){
    event.preventDefault();
  }
  
}
