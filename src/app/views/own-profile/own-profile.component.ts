import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiService } from '../../services/api.service';
import { Message } from 'primeng/components/common/api';
import { HeaderComponent } from '../header/header.component';
declare let $:any;

@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.component.html',
  styleUrls: ['./own-profile.component.scss'],
  providers: [HeaderComponent]
})
export class OwnProfileComponent implements OnInit {

  id: any;
  nickname: any;
  firstname: any;
  lastname: any;
  gender: any;
  avatar: any;
  email: any;
  password: any;
  about: any;
  birthday: any;
  phone: any;
  website: any;
  country: any;
  city: any;
  language: string[];
  registration: any;
  langString: string;

  oldpassword: string;
  newpassword: string;
  birthdayDate: Date;
  
  
  constructor(
    private Title : Title,
    private AppComponent: AppComponent,
    private localStorageService: LocalStorageService,
    private ApiService: ApiService,
    private HeaderComponent: HeaderComponent
  ) {}

  ngOnInit() {
    this.Title.setTitle("Home");
    this.getData();
    this.editData();
  }

  getData(){
      if (!this.localStorageService.get('id')){
         this.getUserData();
      } else {
         this.setData(null);
      }
  }
  
  updateBirthday(){
    this.birthday = this.getDay(this.birthdayDate);
  }
  updateLanguage(){
    this.langString = this.language.join(', ');
  }
  getUserData(){
    if(!this.localStorageService.get('id')){
      this.ApiService.getMyProfile((err, data) => {
        if(err){
          console.log(err);
        } else {
          this.setData(data);
          this.AppComponent.setLocalStorage(data);
        }
      })
    }
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

  getDayTime(date){
    let dateTime = new Date(date);
    let day:any = dateTime.getDate();
    let month:any = dateTime.getMonth() + 1;
    let year = dateTime.getFullYear();
    let hours:any = dateTime.getHours();
    let minutes:any = dateTime.getMinutes();
    if(day < 10) day = '0' + day;
    if(month < 10) month = '0' + month;
    if(hours < 10) hours = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    return `${day}.${month}.${year}   ${hours}:${minutes}`;
  }

  getDate(date){
    return new Date (date);
  }
  
  setData(data):void{
    if(!data) data = false;
    this.id = this.localStorageService.get('id') || data.id || 'unknown';
    this.nickname = this.localStorageService.get('nickname') || data.nickname || 'unknown';
    this.firstname = this.localStorageService.get('firstname') || data.firstname || 'unknown';
    this.lastname = this.localStorageService.get('lastname') || data.lastname || 'unknown';
    this.gender = this.localStorageService.get('gender') || data.gender || 'unknown';
    this.avatar = this.localStorageService.get('avatar') || data.avatar || 'unknown';
    this.email = this.localStorageService.get('email') || data.email || 'unknown';
    this.password = this.localStorageService.get('password') || '********';
    this.about = this.localStorageService.get('about') || data.about  || 'unknown';
    this.birthdayDate = this.getDate(this.localStorageService.get('birthday')) || this.getDate(data.birthday);
    this.phone = this.localStorageService.get('phone') || data.phone || 'unknown';
    this.website = this.localStorageService.get('website') || data.website || 'unknown';
    this.country = this.localStorageService.get('country') || data.country || 'unknown';
    this.city = this.localStorageService.get('city') || data.city || 'unknown';
    this.language = this.localStorageService.get('language') || data.language || 'unknown';
    this.registration = this.getDayTime(this.localStorageService.get('registration')) || this.getDayTime(data.date) || 'unknown';
    if(this.localStorageService.get('birthday') || data.birthday){
      this.birthday = this.getDay(this.localStorageService.get('birthday')) || this.getDay(data.birthday);
    } else{
      this.birthday = 'unknown';
    }
    if(this.language && this.language.length > 0 ){ this.langString = this.language.join(', ');} 
    else {this.langString = 'unknown'}
  }


  cancelEditing(isEdit, parent, buffer){
    $('.update').hide();
    $('.info').show();
    if(isEdit){
      this.setBuffer(parent, buffer);
    }
  }
  

  getBuffer(parent){
    let parentClass = parent.attr('class').substr(0, parent.attr('class').indexOf(" "));
    switch (parentClass) {
      case 'firstname': return this.firstname;
      case 'lastname': return this.lastname;
      case 'gender': return this.gender;
      case 'email': return this.email;
      case 'password': return this.password;
      case 'about': return this.about;
      case 'birthday': return this.birthday;
      case 'phone': return this.phone;
      case 'country': return this.country;
      case 'city': return this.city;
      case 'language': return this.langString;
      case 'website': return this.website;
      default: console.log(new Error('cannot get var')); break;
    }
  }

  setBuffer(parent, buffer){
    let parentClass = parent.attr('class').substr(0, parent.attr('class').indexOf(" "));
    switch (parentClass) {
      case 'firstname': this.firstname = buffer; break;
      case 'lastname': this.lastname = buffer; break;
      case 'gender': this.gender = buffer; break;
      case 'email': this.email = buffer; break;
      case 'password': this.password = buffer; break;
      case 'about': this.about = buffer; break;
      case 'birthday': this.birthday = buffer; break;
      case 'phone': this.phone = buffer; break;
      case 'country': this.country = buffer; break;
      case 'city': this.city = buffer; break;
      case 'language': this.langString = buffer; break;
      case 'website': this.website = buffer; break;
      default: console.log(new Error('cannot get var')); break;
    }
  }

  sendData(data, valueCompare, buffer, saveValue, parentClass, isEdit, parent, update, callback){
    if(valueCompare === ''){
      this.AppComponent.showError('Value is empty!');
      callback(true);
    } else if(valueCompare !== buffer){
      if(isEdit){
        this.ApiService.updateProfile(data, (err, data)=>{
          if(err){
            let errObj = JSON.parse(err);
            this.AppComponent.showError(errObj.message);
            callback(err);
          } else {
            callback(null);
            this.AppComponent.showSuccess('Data is changed!');
            if(update){
              this.AppComponent.updateLocalStorage(parentClass, saveValue);
            }
            else {
              this.cancelEditing(isEdit, parent, buffer);
            }
            $('.update').hide();
            $('.info').show();
          }
        });
      }
    } else {
      this.cancelEditing(isEdit, parent, buffer);
      callback(null);
    }

  }

  saveData(parent, buffer, isEdit, callback){
    let parentClass = parent.attr('class').substr(0, parent.attr('class').indexOf(" "));
    let value;
    let calendarDate;
    let data = {};

    if(parentClass == 'birthday'){
          value = this.getDay(this.birthdayDate);
          calendarDate = this.birthdayDate;
          data[parentClass] = calendarDate;
          this.sendData(data, value, buffer, calendarDate, parentClass, isEdit, parent, true, callback);
          this.updateBirthday();
    } else if(parentClass == 'language'){ 
      value = this.language; 
      data[parentClass] = value;
      this.sendData(data, value, buffer, value, parentClass, isEdit, parent, true, callback);
      this.updateLanguage();
    } else if(parentClass == 'password'){
      value = this.newpassword; 
      data[parentClass] = value;
      data['oldpassword'] = this.oldpassword;
      this.sendData(data, value, buffer, null, null, isEdit, parent, false, callback);
    } else{ 
      if (parentClass == 'firstname' || parentClass == 'lastname'){
          if(this.getBuffer(parent) !== ' '){
            value = this.capitalizeFirstLetter(this.getBuffer(parent));
            this.setBuffer(parent, value);
          } else {
            value = this.getBuffer(parent);
          }
      } else{
         value = this.getBuffer(parent);
      }
      data[parentClass] = value;
      this.sendData(data, value, buffer, value, parentClass, isEdit, parent, true, callback);
    }
  }

  editData(){

    let parent;
    let contentBlock;
    let editBlock;
    let saveBlock;
    let buffer;
    let isEdit = false;
    let thisClass = this;

    document.onkeydown = function(e){
      if(e.keyCode == 27 && isEdit){
        thisClass.cancelEditing(isEdit, parent, buffer);
        isEdit = false;
      }
    }

    $('.save .confirm').on('click', function(){ thisClass.saveData(parent, buffer, isEdit, 
      function(err){
         if(!err){
           isEdit = false;
           thisClass.oldpassword = null;
           thisClass.newpassword = null;
         }
      });
    })

    $('.cancel').on('click', function(){
      thisClass.cancelEditing(isEdit, parent, buffer);
      isEdit = false;
    });

    $('.edit').on('click', function(){

      if(isEdit){
        thisClass.cancelEditing(isEdit, parent, buffer);
      }

      parent = $(this).parent().parent().parent();
      parent.find('.update').show();
      parent.find('.info').hide();

      buffer = thisClass.getBuffer(parent);
      isEdit = true;

      if (buffer == 'unknown' || buffer == '********'){
        thisClass.setBuffer(parent, '');
      }

    })
  }

  capitalizeFirstLetter(string : string) {
    string = string.toLowerCase();
    return string[0].toUpperCase() + string.slice(1);
  }

  avatarPreload(fileInput){
    $('.changeAvatar').css('display', 'flex');
    if (fileInput.files && fileInput.files[0]) {
        let reader:FileReader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.onload = () => { $('#userAvatar').attr("src", reader.result);};
    }
  }
  
  cancelAvatar(fileInput){
    if(fileInput.files && fileInput.files[0]){
      fileInput.value = "";
    }
    $('#userAvatar').attr("src", "assets/img/avatar/" + this.avatar);
    $('.changeAvatar').hide();
  }

  uploadAvatar(fileInput){
    let formData = new FormData();
    if(fileInput.files && fileInput.files[0]){
      formData.append("avatar", fileInput.files[0]);
    }
    this.ApiService.uploadAvatar(formData, (err, data)=>{
        if(err){
          this.AppComponent.showError(err.message);
        } else {
          this.AppComponent.showSuccess("Avatar is changed!");
          this.avatar = data.message;
          this.AppComponent.updateLocalStorage('avatar', data.message);
          this.HeaderComponent.userAvatar = data.message;
          this.HeaderComponent.changeAvatar();
          $('.changeAvatar').hide();
        }
    })
  }

}
