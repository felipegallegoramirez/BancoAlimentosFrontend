import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Report } from "../models/report.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  readonly URL_API = "http://localhost:3000/api/report";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postReport(Report: Report) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_report');
    if (perms) {
      return this.http.post<Report>(this.URL_API, Report,this.httpOptions);
    } else {
      return null;
    }
  }

  async getReports() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_report');
    if (perms) {
      return this.http.get<Report[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
  }


  async getReport(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_report');
    if (perms) {
      return this.http.get<Report>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putReport(id:string, Report: Report) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_report');
    if (perms) {
      return this.http.put<Report>(this.URL_API+`/${id}`,Report,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteReport(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_report');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }
}
