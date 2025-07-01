import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Exit } from "../models/exit.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class ExitService {
  readonly URL_API = "http://localhost:3000/api/outputs";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postExit(Exit: Exit) {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.post<Exit>(this.URL_API, Exit,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async getExits() {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.get<Exit[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getExit(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.get<Exit>(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async putExit(id:string, Exit: Exit) {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.put<Exit>(this.URL_API+`/${id}`,Exit,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async deleteExit(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }
}
