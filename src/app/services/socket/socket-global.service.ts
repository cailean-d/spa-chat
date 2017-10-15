import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class SocketGlobalService {

  id = this.LocalStorageService.get('id');
  nickname = this.LocalStorageService.get('nickname');
  avatar = this.LocalStorageService.get('avatar');
  socket = io({ query: { id: this.id, nickname: this.nickname, avatar: this.avatar } });
  

  constructor(
    private LocalStorageService: LocalStorageService,
  ) { }

  connectSocket(){

    this.socket.on('connection', () => {
      console.log('connected to socket');
    });
  }

  send(){
    this.socket.emit('test', 'hello');
  }


}
