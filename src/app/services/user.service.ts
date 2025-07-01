import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { User } from "../models/user.model";
import { PermsService } from "./perms.service";
import { Observable, from, switchMap, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly URL_API = "http://localhost:3000/api/user";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postUser(User: User): Observable<User> {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'create_user')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.post<User>(this.URL_API, User, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  getUsers(): Observable<User[]> {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'read_user')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.get<User[]>(this.URL_API+``, this.httpOptions);
        } else {
          return of([]);
        }
      })
    );
  }


  getUser(id:string): Observable<User> {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'read_user')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.get<User>(this.URL_API+`/${id}`, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  putUser(id:string, User: User): Observable<User> {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'edit_user')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.put<User>(this.URL_API+`/${id}`, User, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'delete_user')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.delete(this.URL_API+`/${id}`, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  login(email:string, password:string ) {
    let data ={
      email,
      password
    }
    return this.http.post<any>(`http://localhost:3000/api/auth/`,data);
  }

}
