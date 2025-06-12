import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { TypeDocument } from "../models/type_document.model";

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  readonly URL_API = "http://localhost:3000/api/type_document";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postTypeDocument(TypeDocument: TypeDocument) {
    return this.http.post<TypeDocument>(this.URL_API, TypeDocument,this.httpOptions);
  }

  getTypeDocuments() {
    return this.http.get<TypeDocument[]>(this.URL_API+``,this.httpOptions);
  }


  getTypeDocument(id:string) {
    return this.http.get<TypeDocument>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putTypeDocument(id:string, TypeDocument: TypeDocument) {
    return this.http.put<TypeDocument>(this.URL_API+`/${id}`,TypeDocument,this.httpOptions);
  }

  deleteTypeDocument(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
}
