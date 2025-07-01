import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { LogsAlert } from "../models/logs_alert.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class LogsAlertsService {
  readonly URL_API = "http://localhost:3000/api/log_alerts";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postLogsAlert(LogsAlert: LogsAlert) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_logs');
    if (perms) {
      return this.http.post<LogsAlert>(this.URL_API, LogsAlert,this.httpOptions);
    } else {
      return null;
    }
  }

  async getLogsAlerts() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_logs');
    if (perms) {
      return this.http.get<LogsAlert[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getLogsAlert(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_logs');
    if (perms) {
      return this.http.get<LogsAlert>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putLogsAlert(id:string, LogsAlert: LogsAlert) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_logs');
    if (perms) {
      return this.http.put<LogsAlert>(this.URL_API+`/${id}`,LogsAlert,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteLogsAlert(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_logs');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }


}
