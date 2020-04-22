import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  usr: User;
  photoUrl: string;
  constructor(public authService: AuthService , private alertify: AlertifyService,private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login()
  {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in Successfully');
    }, error => {
      this.alertify.error(error);
      //console.log(error);
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  loggedIn()
  {
    return this.authService.loggedIn();
    //this.usr = JSON.parse(localStorage.getItem('user'));

    //const token= localStorage.getItem('token');
    //return !! token;
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('Logged Out');
    this.router.navigate(['']);
    //console.log('Logged Out');
  }
}
