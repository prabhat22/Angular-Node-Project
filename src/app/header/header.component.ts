import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  authListnerSub: Subscription;
   isUserAuth= false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuth = this.authService.getIsAuth();
    this.authListnerSub = this.authService.getAuthStatusListner().subscribe((isAuth) => {
      this.isUserAuth = isAuth;
     });
  }
  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }
  onLogout() {
    console.log('logout call');

    this.authService.logout();
  }

}
