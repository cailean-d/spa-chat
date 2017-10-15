import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FriendsApiService {

  private URL_INVITE: string = 'api/friends/invite/';
  private URL_FRIEND: string = 'api/friends/friend/';
  private URL_GET_INVITES: string = 'api/friends/invites';
  private URL_GET_FRIENDS: string = 'api/friends/friends';
  private URL_INVITES_COUNT: string = 'api/friends/invites/count';
  private URL_FRIENDS_COUNT: string = 'api/friends/friends/count';
  
  private HEADERS_POST = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient
  ) { }

  getInvites(callback: Function):any{
    this.http.get(this.URL_GET_INVITES, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getFriends(callback: Function):any{
    this.http.get(this.URL_GET_FRIENDS, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getInvitesCount(callback: Function){
    this.http.get(this.URL_INVITES_COUNT, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getFriendsCount(callback: Function){
    this.http.get(this.URL_FRIENDS_COUNT, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  inviteFriend(id : number, callback: Function):any{
    this.http.post(this.URL_INVITE + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  addFriend(id : number, callback: Function):any{
    this.http.post(this.URL_FRIEND + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }
  rejectFriend(id : number, callback: Function):any{
    this.http.delete(this.URL_INVITE + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  deleteFriend(id : number, callback: Function):any{
    this.http.delete(this.URL_FRIEND + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  isInvited(id : number, callback: Function):any{
    this.http.put(this.URL_INVITE + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  isFriend(id : number, callback: Function):any{
    this.http.put(this.URL_FRIEND + id, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }
}
