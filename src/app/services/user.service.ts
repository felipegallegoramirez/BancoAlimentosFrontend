import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly URL_API = "http://localhost:3000/api/user";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postUser(User: User) {
    return this.http.post<User>(this.URL_API, User,this.httpOptions);
  }

  getUsers() {
    return this.http.get<User[]>(this.URL_API+``,this.httpOptions);
  }


  getUser(id:string) {
    return this.http.get<User>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putUser(id:string, User: User) {
    return this.http.put<User>(this.URL_API+`/${id}`,User,this.httpOptions);
  }

  deleteUser(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }

  login(email:string, password:string ) {
    let data ={
      email,
      password
    }
    return this.http.post<any>(`http://localhost:3000/api/auth/`,data);
  }

}
