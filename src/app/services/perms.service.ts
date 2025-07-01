import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PermsService {

  constructor(private http: HttpClient) { }

  async getPerms(id: string, role: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'http://localhost:3000/api/permission/hasPermission?id_user='+id+'&name_permission='+role;
    console.log(url);
    return this.http.get<boolean>(url, { headers }).toPromise();
  }

}
