import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Report } from "../models/report.model";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  readonly URL_API = "http://localhost:3000/api/report";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postReport(Report: Report) {
    return this.http.post<Report>(this.URL_API, Report,this.httpOptions);
  }

  getReports() {
    return this.http.get<Report[]>(this.URL_API+``,this.httpOptions);
  }


  getReport(id:string) {
    return this.http.get<Report>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putReport(id:string, Report: Report) {
    return this.http.put<Report>(this.URL_API+`/${id}`,Report,this.httpOptions);
  }

  deleteReport(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
}
