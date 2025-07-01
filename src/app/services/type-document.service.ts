import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { TypeDocument } from "../models/type_document.model";
import { PermsService } from "./perms.service";

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


  async postTypeDocument(TypeDocument: TypeDocument) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_type_document');
    if (perms) {
      return this.http.post<TypeDocument>(this.URL_API, TypeDocument,this.httpOptions);
    } else {
      return null;
    }
  }

  async getTypeDocuments() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_type_document');
    if (perms) {
      return this.http.get<TypeDocument[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
  }


  async getTypeDocument(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_type_document');
    if (perms) {
      return this.http.get<TypeDocument>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putTypeDocument(id:string, TypeDocument: TypeDocument) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_type_document');
    if (perms) {
      return this.http.put<TypeDocument>(this.URL_API+`/${id}`,TypeDocument,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteTypeDocument(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_type_document');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }
}
