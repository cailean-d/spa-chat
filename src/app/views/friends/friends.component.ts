import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  
  windowHash: string = window.location.hash;

  constructor(
    private Title: Title,
    private ActivatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.Title.setTitle('Друзья');
  }

}
