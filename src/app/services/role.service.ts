import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Role } from "../models/role.model";
import { PermsService } from "./perms.service";
import { Observable, from, switchMap, of } from "rxjs";

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

  postRole(Role: Role): Observable<Role> | null {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'create_role')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.post<Role>(this.URL_API, Role, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  getRoles(): Observable<Role[]> | null {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'read_role')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.get<Role[]>(this.URL_API+``, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }


  getRole(id:string): Observable<Role> | null {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'read_role')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.get<Role>(this.URL_API+`/${id}`, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  putRole(id:string, Role: Role): Observable<Role> | null {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'edit_role')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.put<Role>(this.URL_API+`/${id}`, Role, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }

  deleteRole(id: string): Observable<any> | null {
    const id_user = localStorage.getItem('id');
    return from(this.permsService.getPerms(id_user, 'delete_role')).pipe(
      switchMap(perms => {
        if (perms) {
          return this.http.delete(this.URL_API+`/${id}`, this.httpOptions);
        } else {
          return of(null);
        }
      })
    );
  }


}
