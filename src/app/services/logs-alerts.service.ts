import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { LogsAlert } from "../models/logs_alert.model";

@Injectable({
  providedIn: 'root'
})
export class LogsAlertsService {
  readonly URL_API = "http://localhost:3000/api/log_alerts";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postLogsAlert(LogsAlert: LogsAlert) {
    return this.http.post<LogsAlert>(this.URL_API, LogsAlert,this.httpOptions);
  }

  getLogsAlerts() {
    return this.http.get<LogsAlert[]>(this.URL_API+``,this.httpOptions);
  }


  getLogsAlert(id:string) {
    return this.http.get<LogsAlert>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putLogsAlert(id:string, LogsAlert: LogsAlert) {
    return this.http.put<LogsAlert>(this.URL_API+`/${id}`,LogsAlert,this.httpOptions);
  }

  deleteLogsAlert(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }


}
