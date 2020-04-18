import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(public authService: AuthService , private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login()
  {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in Successfully');
    }, error => {
      this.alertify.error(error);
      //console.log(error);
    });
  }

  loggedIn()
  {
    return this.authService.loggedIn();
    //const token= localStorage.getItem('token');
    //return !! token;
  }

  logout()
  {
    localStorage.removeItem('token');
    this.alertify.message('Logged Out');
    //console.log('Logged Out');
  }
}
