import { FriendsApiService } from '../../services/api/friends-api.service';
import { LocalStorageService } from 'angular-2-local-storage/dist';
import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
declare let $:any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  id:number;
  nickname: string;
  firstname: string;
  lastname: string;
  avatar: string;
  gender: string;
  about: string;
  birthday: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  language: string;

  addInfo: boolean;
  profileClass: string;
  profileIsExists: boolean;
  isDisableAdd: boolean;
  isFriend: boolean;
  isInvited: boolean;
  me_isInvited: boolean;
  buttonText: string;

  constructor(
    private Title: Title,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ApiService: ApiService,
    private AppComponent: AppComponent,
    private LocalStorageService: LocalStorageService,
    private FriendsApiService: FriendsApiService
  ) { }

  ngOnInit() {
    this.getUserID();
    this.setData();
    if(!this.isNumber(this.id)){
      this.Router.navigate(['/404']);
    } else if (this.id == this.LocalStorageService.get('id')){
      this.Router.navigate(['/']);
    } 
    this.setClass();
    this.getUserStatus();
  }


  getUserID(){
    this.ActivatedRoute.params.subscribe(params => {
      this.id = +params['id']; 
   });
  }

  isNumber(val){
    return /^\d+$/.test(val);
  }

  isAddInfo(){
    return  this.isVarExists(this.about) || 
            this.isVarExists(this.birthday) || 
            this.isVarExists(this.phone) || 
            this.isVarExists(this.website) || 
            this.isVarExists(this.country) || 
            this.isVarExists(this.city) || 
            this.isVarExists(this.language);
  }

  isVarExists(variable){
    return (typeof(variable) !== 'undefined')
  }

  getDay(date){
    let dateTime = new Date(date);
    let day:any = dateTime.getDate();
    let month:any = dateTime.getMonth() + 1;
    let year = dateTime.getFullYear();

    if(day < 10) day = '0' + day;
    if(month < 10) month = '0' + month;

    return `${day}.${month}.${year}`;
  }

  setData(){
    let thisClass = this;
    this.ApiService.getUser(this.id, function(err, data){
      if(err){
        thisClass.profileIsExists = false;
        thisClass.Title.setTitle("User not found");
      } else {
        thisClass.profileIsExists = true;
        thisClass.nickname = data.nickname;
        thisClass.firstname = data.firstname;
        thisClass.lastname = data.lastname;
        thisClass.avatar = data.avatar;
        thisClass.gender = data.gender;
        thisClass.about = data.about;
        thisClass.birthday = thisClass.getDay(data.birthday);
        thisClass.phone = data.phone;
        thisClass.website = data.website;
        thisClass.country = data.country;
        thisClass.city = data.city;
        thisClass.language = data.language.join(', ');
        thisClass.addInfo =  thisClass.isAddInfo();
        thisClass.Title.setTitle(thisClass.nickname);
      }
    });
  }

  setClass(){
    setTimeout(()=>{
      if($(".profile")[0].scrollHeight - 1 > $(".profile")[0].clientHeight){
        this.profileClass = 'scroll';
      } else {
        this.profileClass = 'noscroll';
      }
    }, 100);
  }

  getUserStatus(){
    this.userIsFriend((data)=>{
      if(data){
          this.isFriend = true;
          this.isDisableAdd = false;
          this.buttonText = 'Delete from friends';
      } else {
        this.userIsInvited((data)=>{
          if(data){
            this.isInvited = true;
            this.isDisableAdd = true;
            this.buttonText = 'Invited';
          } else {
            this.meIsInvited((data) =>{
              if(data){
                this.me_isInvited = true;
                this.buttonText = 'Confirm friendship';
              } else {
                this.buttonText = 'Add to friends';
              }
            })
          }
        })
      }
    });
  }

  userIsFriend(callback){
    this.FriendsApiService.isFriend(this.id, (err, data) =>{
        if(err){
          callback(false);
        } else {
          callback(true);
        }
    })
  }

  userIsInvited(callback){
    this.FriendsApiService.isInvited(this.id, (err, data) => {
      if(err){
        callback(false);
      } else {
        callback(true);
      }
    })
  }
  
  meIsInvited(callback){
    this.FriendsApiService.meIsInvited(this.id, (err, data) => {
      if(err){
        callback(false);
      } else {
        callback(true);
      }
    })
  }

  addToFriends(){
    this.FriendsApiService.addFriend(this.id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        this.isFriend = true;
        this.isDisableAdd = false;
        this.buttonText = 'Delete from friends';
        this.AppComponent.showInfo(this.nickname + ' added to friends');
      }
    })
  }

  inviteToFriends(){
    this.FriendsApiService.inviteFriend(this.id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        this.isInvited = true;
        this.isDisableAdd = true;
        this.buttonText = 'Invited';
        this.AppComponent.showInfo('You sent invite to ' + this.nickname)
      }
    })
  }

  deleteFriend(){
    this.FriendsApiService.deleteFriend(this.id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        this.isInvited = false;
        this.isDisableAdd = false;
        this.isFriend = false;
        this.me_isInvited = false;
        this.buttonText = 'Add to friends';
        this.AppComponent.showInfo(this.nickname + ' is deleted from friends');
      }
    })
  }

  friendFunc(){
    if(this.isFriend){
      this.deleteFriend();
    } else if(this.me_isInvited){
      this.addToFriends();
    } else if(!this.isFriend && !this.isInvited){
      this.inviteToFriends();
    }
  }

}
