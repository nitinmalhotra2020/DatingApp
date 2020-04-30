import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users: User[];
pagination: Pagination;
likesParam: string;
  constructor(private authService: AuthService,
              private userService: UserService ,
              private alertifyService: AlertifyService ,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void
{
  this.pagination.currentPage = event.page;
  this.loadUsers();
}
  loadUsers()
  {
    this.userService.getUsers(this.pagination.currentPage , this.pagination.itemsPerPage , null, this.likesParam)
    .subscribe((res: PaginatedResult<User[]>) =>
      {
      this.users = res.result;
      this.pagination = res.pagination;
      }, error => {
        this.alertifyService.error(error);
      });
  }

}
