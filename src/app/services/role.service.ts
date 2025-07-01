import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Role } from "../models/role.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  readonly URL_API = "http://localhost:3000/api/role";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };

  async postRole(Role: Role) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_role');
    if (perms) {
      return this.http.post<Role>(this.URL_API, Role,this.httpOptions);
    } else {
      return null;
    }
    return this.http.post<Role>(this.URL_API, Role,this.httpOptions);
  }

  async getRoles() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_role');
    if (perms) {
      return this.http.get<Role[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
    return this.http.get<Role[]>(this.URL_API+``,this.httpOptions);
  }


  async getRole(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_role');
    if (perms) {
      return this.http.get<Role>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
    return this.http.get<Role>(this.URL_API+`/${id}`,this.httpOptions);
  }

  async putRole(id:string, Role: Role) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_role');
    if (perms) {
      return this.http.put<Role>(this.URL_API+`/${id}`,Role,this.httpOptions);
    } else {
      return null;
    }
    return this.http.put<Role>(this.URL_API+`/${id}`,Role,this.httpOptions);
  }

  async deleteRole(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_role');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }


}
