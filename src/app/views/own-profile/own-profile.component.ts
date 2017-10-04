import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.css']
})
export class OwnProfileComponent implements OnInit {

  constructor(
    private Title : Title
  ) { }

  ngOnInit() {
    this.Title.setTitle('Главная');
  }

}
