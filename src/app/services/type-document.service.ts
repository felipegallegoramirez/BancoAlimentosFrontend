import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { TypeDocument } from "../models/type_document.model";
import { PermsService } from "./perms.service";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  readonly URL_API = "http://localhost:3000/api/type_document";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postTypeDocument(TypeDocument: TypeDocument): Observable<TypeDocument> {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.post<TypeDocument>(this.URL_API, TypeDocument,this.httpOptions);
    } else {
      return of(null);
    }
  }

  getTypeDocuments(): Observable<TypeDocument[]> {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.get<TypeDocument[]>(this.URL_API+``,this.httpOptions);
    } else {
      return of([]);
    }
  }


  getTypeDocument(id:string): Observable<TypeDocument> {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.get<TypeDocument>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return of(null);
    }
  }

  putTypeDocument(id:string, TypeDocument: TypeDocument): Observable<TypeDocument> {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.put<TypeDocument>(this.URL_API+`/${id}`,TypeDocument,this.httpOptions);
    } else {
      return of(null);
    }
  }

  deleteTypeDocument(id: string): Observable<any> {
    const id_user = localStorage.getItem('id');
    const perms = true;
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return of(null);
    }
  }
}
