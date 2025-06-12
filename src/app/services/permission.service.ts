import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Permission } from "../models/permission.model";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  readonly URL_API = "http://localhost:3000/api/permission";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postPermission(Permission: Permission) {
    return this.http.post<Permission>(this.URL_API, Permission,this.httpOptions);
  }

  getPermissions() {
    return this.http.get<Permission[]>(this.URL_API+``,this.httpOptions);
  }


  getPermission(id:string) {
    return this.http.get<Permission>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putPermission(id:string, Permission: Permission) {
    return this.http.put(this.URL_API+`/${id}`,Permission,this.httpOptions);
  }

  deletePermission(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }


}
