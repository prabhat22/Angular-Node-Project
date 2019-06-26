import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component(
  {
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
  }
)
export class LoginComponent implements OnInit
{

  isLoading=false;
  constructor(private authService:AuthService)
  {}
  ngOnInit()
  {
    this.authService.getAuthStatusListner().subscribe(()=>
    {
      this.isLoading=false;
    })
  }
  onSubmit(form: NgForm)
  {
    if(form.invalid)
    {
      return false;
    }
    this.authService.loginUser(form.value.email,form.value.pwd)  ;
    this.isLoading=true;
  }

}

