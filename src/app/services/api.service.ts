import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {

  private getUsersURL: string = 'api/users';
  private getUsersCountURL: string = 'api/users/count';
  private getMyProfileURL: string = 'api/users/me';
  private UsersURL: string = 'api/users/';
  private countUsersURL: string = 'api/users/count';

  private uploadAvatarURL: string = 'api/upload/avatar';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }


  getMyProfile(callback: Function):any{
    this.http.get(this.getMyProfileURL, {})
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
    this.http.put(this.getUsersURL, data, {headers : this.headers})
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
    this.http.delete(this.getUsersURL)
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
    this.http.get(this.countUsersURL, {})
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
    this.http.get(this.UsersURL + id, {})
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
    this.http.get(this.UsersURL + `?offset=${offset}&limit=${limit}`, {})
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
    this.http.post(this.uploadAvatarURL, data)
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
