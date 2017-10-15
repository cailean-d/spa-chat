import { AppComponent } from '../../app.component';
import { FriendsApiService } from '../../services/api/friends-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare let $:any;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  
  friendsCount: number = 0;
  friendsOnlineCount: number = 0;
  invitesCount: number = 0;
  invites: object;
  friends: object;

  constructor(
    private Title: Title,
    private ActivatedRoute: ActivatedRoute,
    private FriendsApiService: FriendsApiService,
    private AppComponent: AppComponent
  ) { 
    this.FriendsApiService.getFriendsCount((err, data) =>{
        if(err){
          this.AppComponent.showError(err.message);
        } else{
          if(data > 0){
            this.friendsCount = data;
          }
        }
    });
    this.FriendsApiService.getInvitesCount((err, data) => {
       if(err){
         this.AppComponent.showError(err.mesage);
       } else {
          if(data > 0){
            this.invitesCount = data;
          }
       }
    })
    this.FriendsApiService.getFriends((err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        this.friends = data;
      }
    })
    this.FriendsApiService.getInvites((err, data) =>{
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        this.invites = data;
      }
    })
  }

  ngOnInit() {

    this.Title.setTitle('Friends');

    if(location.hash == '' || location.hash == '#1'){
        this.select_tab('all-friends');
    } else if (location.hash == '#2'){
        this.select_tab('online-friends');
    } else if (location.hash == '#3'){
        this.select_tab('invites');
    }
  }

  select_tab(tab){
    $('.tabs-buttons').children().removeClass('active');       
    $('.' + tab).addClass('active');        
    $('.tabs-body').children().hide();
    $('.tabs-body .' + tab).show();
  }

  click_tab(elem){
    let tab = $(elem).attr('class').split(' ')[0];
    $('.tabs-buttons').children().removeClass('active');       
    $('.'+ tab).addClass('active');        
    $('.tabs-body').children().hide();
    $('.tabs-body .' + tab).show();

      if(tab == 'all-friends'){
         window.location.hash = '#1'
      } else if (tab == 'online-friends'){
         window.location.hash = '#2'
      } else if (tab == 'invites'){
         window.location.hash = '#3'
      }
  }

  mouseOver(elem){
    $(elem).find('.id i').css('opacity', '1');
  }

  mouseLeave(elem){
    $(elem).find('.id i').css('opacity', '0');
  }

  addToFriends(elem){
    let id = $(elem).attr("id");
    this.FriendsApiService.addFriend(id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        $(`.user[id=${id}]`).remove();
        this.invitesCount--;
        this.friendsCount++;
        this.AppComponent.showInfo(`User added to friends`);
      }
    })
  }

  deleteInvite(elem){
    let id = $(elem).attr("id");
    this.FriendsApiService.rejectFriend(id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        $(`.user[id=${id}]`).remove();
        this.invitesCount--;
        this.AppComponent.showInfo('Friendship rejected');
      }
    })
  }

  deleteFriend(elem){
    let id = $(elem).attr("id");
    this.FriendsApiService.deleteFriend(id, (err, data) => {
      if(err){
        this.AppComponent.showError(err.message);
      } else {
        $(`.user[id=${id}]`).remove();
        this.friendsCount--;
        this.AppComponent.showInfo('Friend is deleted');
      }
    })
  }
  

}
