import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
// import * as jwt_decode from 'jwt-decode';

interface ItemsResponse {
  status: number;
  message: boolean;
}

@Injectable()
export class AuthService {

  isAuth:boolean; 
  
  private regURL: string = 'auth/reg';
  private loginURL: string = 'auth/login';
  private logoutURL: string = 'auth/logout';
  private checkURL: string = 'auth/check';
  
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(private http: HttpClient) { }

  checkAuth(callback : Function): Promise<boolean> {
   return new Promise((resolve, reject) => {
      this.http.post<ItemsResponse>(this.checkURL, {})
      .toPromise().then(
        res => { 
          this.isAuth = true;
          callback(null, res);
          resolve(res.message);
        },
        err => {
          this.isAuth = false;
          callback(err.error);
          resolve(err.error.message);
        }
      );
    });
  }

  loginAuth(data : Object, callback: Function):any{
     this.http.post<ItemsResponse>(this.loginURL, data, {headers : this.headers})
     .toPromise().then(
       res => { 
        this.isAuth = true;
         callback(null, res);
       },
       err => {
         callback(err.error);
       }
     );
  }

  regAuth(data : Object, callback: Function):any{
    this.http.post<ItemsResponse>(this.regURL, data, {headers : this.headers})
    .toPromise().then(
      res => { 
        this.isAuth = true;
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
  }

 logoutAuth(callback: Function):any{
    this.http.post<ItemsResponse>(this.logoutURL, {})
    .toPromise().then(
      res => { 
        this.isAuth = false;
        callback(null, res);
      },
      err => {
        callback(err.error);
      }
    );
 }

  // getToken(): string {
  //   return localStorage.getItem('jwt');
  // }

  // setToken(token: string): void {
  //   localStorage.setItem('jwt', token);
  // }

  // getTokenExpirationDate(token: string): Date {
  //   const decoded = jwt_decode(token);

  //   if (decoded.exp === undefined) return null;

  //   const date = new Date(0); 
  //   date.setUTCSeconds(decoded.exp);
  //   return date;
  // }

  // isTokenExpired(token?: string): boolean {
  //   if(!token) token = this.getToken();
  //   if(!token) return true;

  //   const date = this.getTokenExpirationDate(token);
  //   if(date === undefined) return false;
  //   return !(date.valueOf() > new Date().valueOf());
  // }

}
