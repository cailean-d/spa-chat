import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( 
    private authService: AuthService,
    private router: Router
  ) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
   return this.authService.checkAuth((err, res) => {
      if (err) {
        this.router.navigate(['login']);
      }
   });
  }
}
