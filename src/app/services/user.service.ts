import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { User } from "../models/user.model";
import { PermsService } from "./perms.service";

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


  async postUser(User: User) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_user');
    if (perms) {
      return this.http.post<User>(this.URL_API, User,this.httpOptions);
    } else {
      return null;
    }
  }

  async getUsers() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_user');
    if (perms) {
      return this.http.get<User[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
  }


  async getUser(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_user');
    if (perms) {
      return this.http.get<User>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putUser(id:string, User: User) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_user');
    if (perms) {
      return this.http.put<User>(this.URL_API+`/${id}`,User,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteUser(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_user');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  login(email:string, password:string ) {
    let data ={
      email,
      password
    }
    return this.http.post<any>(`http://localhost:3000/api/auth/`,data);
  }

}
