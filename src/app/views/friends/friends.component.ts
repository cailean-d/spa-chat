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

  constructor(
    private Title: Title,
    private ActivatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.Title.setTitle('Друзья');

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

  click_tab(event){
    event.preventDefault();
    let tab = $(event.target).attr('class').split(' ')[0];
    if(tab !== 'count'){
      $('.' + tab).on('click', function(){
        $('.tabs-buttons').children().removeClass('active');       
        $(this).addClass('active');        
        $('.tabs-body').children().hide();
        $('.tabs-body .' + tab).show();
      if(tab == 'all-friends'){
         window.location.hash = '#1'
      } else if (tab == 'online-friends'){
         window.location.hash = '#2'
      } else if (tab == 'invites'){
         window.location.hash = '#3'
      }
      })
    }

  }


}
