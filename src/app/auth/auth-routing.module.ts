import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { SignUpComponent } from './signUp/signUp.component';
import { LoginComponent } from './login/login.component';

const routes: Routes=[
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signUp',
    component: SignUpComponent
  }
]
@NgModule(
  {
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
  }
)
export class AuthRoutingModule
{}
