import { Component } from '@angular/core';
import { NgProgressService } from 'ngx-progressbar';

@Component({
  selector: 'app-root',
  template: `
            <ng-progress 
            [positionUsing]="'marginLeft'" 
            [minimum]="0.08" 
            [maximum]="1"
            [speed]="200" 
            [showSpinner]="false" 
            [direction]="'leftToRightIncreased'"
            [color]="'#29d'" 
            [trickleSpeed]="250" 
            [thick]="true" 
            [ease]="'linear'"
            ></ng-progress>
            <router-outlet></router-outlet>
            `
})
export class AppComponent {
  UserData: object;
  DataIsReceived:boolean;
}
