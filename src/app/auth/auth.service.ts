import { Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import {environment} from '../../environments/environment';

const Backend_Url=environment.url;
@Injectable()
export class AuthService {
  private token: string;
  private AuthListner = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  constructor(private http: HttpClient, private route: Router) {}

  getToken() {
    console.log('get tokn is:', this.token);
    return this.token;
  }
  getIsAuth() {
    return this.isAuth;
  }
  createUser(email: string, password: string) {

      const user: UserModel = {email, pwd: password};

      this.http.post(Backend_Url+'user/signup', user).subscribe((result) => {
        console.log(result);
        this.route.navigate(['']);
     },(err)=>
     {
       console.log(err);
       this.AuthListner.next(false);
     });
  }
  loginUser(email: string, pwd: string) {
    const user: UserModel = {email , pwd};

    this.http.post<{ token: string, expiresIn: number,userId:string}>(Backend_Url+'user/login', user).subscribe((result) => {
      console.log(result.token);
      const token = result.token;
      this.token = token;
      if (token) {
        const expireDuration = result.expiresIn;
        console.log(expireDuration);
            this.setTimer(expireDuration);
      //  localStorage.setItem('token', token);
        const now = new Date();
        const expireDate = new Date(now.getTime() + expireDuration * 1000);
        this.saveAuthData(token, expireDate,result.userId);
        this.isAuth = true;
        this.AuthListner.next(true);
        this.route.navigate(['']);

      }

      console.log(this.token);
   },(err)=>
   {
     console.log(err);
     this.AuthListner.next(false);
   });
  }
  autoAuthUser()
  {
    const authInfo=this.getAuthData();
    if(!authInfo)
    {
      return ;
    }
    const now =new Date();
    const expireIn=authInfo.expirationDate.getTime() - now.getTime();
    if(expireIn>0)
    {
      this.token=authInfo.token;
      this.isAuth=true;
      this.AuthListner.next(true);
      this.setTimer(expireIn/1000);
    }
  }
  setTimer(duration:number)
  {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  getAuthStatusListner() {
    return this.AuthListner.asObservable();
  }
  logout() {
    this.token = null;
    this.isAuth = false;
  //  localStorage.removeItem('token');
    this.AuthListner.next(false);
    clearTimeout(this.tokenTimer);
    this.route.navigate(['']);
    this.clearAuthData();
  }
  saveAuthData(token: string, expirationdDate: Date,userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationdDate.toISOString());
    localStorage.setItem('userID',userId);

  }
  clearAuthData() {
    localStorage.clear();
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return  ;
    }
    return{
        token: token,
        expirationDate: new Date(expirationDate)
      }

  }
}
