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
    return this.http.get<boolean>('http://localhost:3000/permission/hasPermission/'+id+'/'+role, { headers }).toPromise();
  }

}
