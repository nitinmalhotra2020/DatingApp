import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

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

  getUsers(page?, itemsPerPage? , userparams?, likesParam?): Observable<PaginatedResult<User[]>>
  {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null)
    {
      params = params.append('pageNumber' , page);
      params = params.append('pageSize' , itemsPerPage);
    }

    if (userparams != null)
    {
      params = params.append('minAge' , userparams.minAge);
      params = params.append('maxAge' , userparams.maxAge);
      params = params.append('gender' , userparams.gender);
      params = params.append('orderBy' , userparams.orderBy);
    }

    if (likesParam === 'Likers')
    {
      params = params.append('likers' , 'true');
    }
    if (likesParam === 'Likees')
    {
      params = params.append('likees' , 'true');
    }

    //return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);

    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
      .pipe(
          map(response => {
          paginatedResult.result = response.body; 
          if (response.headers.get('Pagination') != null){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;})
          );
  }

  getUser(id): Observable<User>{
    //return this.http.get<User>(this.baseUrl + 'users/' + id , httpOptions);
    return this.http.get<User>(this.baseUrl + 'users/' + id );
  }
  updateUser(id: number , user: User)
  {
    return this.http.put(this.baseUrl + 'users/' +  id, user);
  }

  setMain(userId: number , id: number)
  {
    return this.http.post(this.baseUrl + 'users/' +  userId + '/photos/' + id + '/setmain', {});
  }

  deletePhoto(userId: number , id: number)
  {
    return this.http.delete(this.baseUrl + 'users/' +  userId + '/photos/' + id );
  }

  sendLike(id: number , recipientId: number)
  {
    return this.http.post(this.baseUrl + 'users/' +  id + '/like/' + recipientId,{} );
  }

}
