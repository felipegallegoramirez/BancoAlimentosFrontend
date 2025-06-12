import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Role } from "../models/role.model";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  readonly URL_API = "http://localhost:3000/api/role";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postRole(Role: Role) {
    return this.http.post<Role>(this.URL_API, Role,this.httpOptions);
  }

  getRoles() {
    return this.http.get<Role[]>(this.URL_API+``,this.httpOptions);
  }


  getRole(id:string) {
    return this.http.get<Role>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putRole(id:string, Role: Role) {
    return this.http.put<Role>(this.URL_API+`/${id}`,Role,this.httpOptions);
  }

  deleteRole(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }


}
