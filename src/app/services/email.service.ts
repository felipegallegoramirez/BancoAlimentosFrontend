import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Email } from "../models/email.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  readonly URL_API = "http://localhost:3000/api/email";
  token = localStorage.getItem('token');
  
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };

  async postEmail(Email: Email): Promise<Observable<Email> | null> {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_email');
    if (perms) {
      return this.http.post<Email>(this.URL_API, Email, this.httpOptions);
    } else {
      return null;
    }
  }

  async getEmails(): Promise<Observable<Email[]> | null> {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_email');
    if (perms) {
      return this.http.get<Email[]>(this.URL_API, this.httpOptions);
    } else {
      return null;
    }
  }

  async getEmail(id: string): Promise<Observable<Email> | null> {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_email');
    if (perms) {
      return this.http.get<Email>(this.URL_API + `/${id}`, this.httpOptions);
    } else {
      return null;
    }
  }

  async putEmail(id: string, Email: Email): Promise<Observable<Email> | null> {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_email');
    if (perms) {
      return this.http.put<Email>(this.URL_API + `/${id}`, Email, this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteEmail(id: string): Promise<Observable<any> | null> {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_email');
    if (perms) {
      return this.http.delete(this.URL_API + `/${id}`, this.httpOptions);
    } else {
      return null;
    }
  }
}
