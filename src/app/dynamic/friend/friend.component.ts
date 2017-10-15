import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  
  @Input() id: number;
  @Input() nickname: string;
  @Input() avatar: string;
  
  constructor() { }

  ngOnInit() {
  }

}
