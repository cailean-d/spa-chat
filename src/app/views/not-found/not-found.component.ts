import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private Title : Title) { }

  ngOnInit() {
    this.Title.setTitle('Page not found');
  }

  disableMenu(event){
    event.preventDefault();
  }

}
