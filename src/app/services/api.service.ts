import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

interface UserResponse {
  firstname : string,
  lastname : string,
  email : string,
  password : string,
  gender : string
}

@Injectable()
export class ApiService {

  private getUsersURL: string = 'api/users';
  private getUsersCountURL: string = 'api/users/count';
  private getMyProfileURL: string = 'api/users/me';
  private UsersURL: string = 'api/users/';
  
  constructor(private http: HttpClient) { }


  getMyProfile(callback: Function):any{
    this.http.get<UserResponse>(this.getMyProfileURL, {})
    .toPromise().then(
      res => { 
        console.log('qq');
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
 }

}
