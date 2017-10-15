import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {

  private URL_GET_USERS: string = 'api/users';
  private URL_USERS_COUNT: string = 'api/users/count';
  private URL_GET_MY_PROFILE: string = 'api/users/me';
  private URL_GET_USER_PROFILE: string = 'api/users/';

  private URL_UPLOAD_AVATAR: string = 'api/upload/avatar';

  private HEADERS_POST = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(
    private http: HttpClient
  ) { }


  getMyProfile(callback: Function):any{
    this.http.get(this.URL_GET_MY_PROFILE, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  updateProfile(data : Object, callback: Function):any{
    this.http.put(this.URL_GET_USERS, data, {headers : this.HEADERS_POST})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }
  deleteProfile(data : Object, callback: Function):any{
    this.http.delete(this.URL_GET_USERS)
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getUsersCount(callback: Function):any{
    this.http.get(this.URL_USERS_COUNT, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getUser(id:number, callback: Function):any{
    this.http.get(this.URL_GET_USER_PROFILE + id)
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  getUsers(offset:number, limit:number, callback: Function):any{
    this.http.get(this.URL_GET_USER_PROFILE + `?offset=${offset}&limit=${limit}`, {})
    .toPromise().then(
      res => { 
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

  uploadAvatar(data : Object, callback: Function):any{
    this.http.post(this.URL_UPLOAD_AVATAR, data)
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
