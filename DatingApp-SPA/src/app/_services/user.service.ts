import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

//This has been removed as we are now using JWT Module

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]>{
    //return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  getUser(id): Observable<User>{
    //return this.http.get<User>(this.baseUrl + 'users/' + id , httpOptions);
    return this.http.get<User>(this.baseUrl + 'users/' + id );
  }
  updateUser(id: number , user: User)
  {
    return this.http.put(this.baseUrl + 'users/' +  id, user);
  }

}
