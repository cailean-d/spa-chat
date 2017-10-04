import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-chat',
  templateUrl: './general-chat.component.html',
  styleUrls: ['./general-chat.component.css']
})
export class GeneralChatComponent implements OnInit {

  constructor(
    private Title: Title
  ) { }

  ngOnInit() {
    this.Title.setTitle('Общий чат');
  }

}
