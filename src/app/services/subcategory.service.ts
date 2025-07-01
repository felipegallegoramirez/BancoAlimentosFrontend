import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Subcategory } from "../models/subcategory.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  readonly URL_API = "http://localhost:3000/api/subcategory";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postSubcategory(Subcategory: Subcategory) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_subcategory');
    if (perms) {
      return this.http.post<Subcategory>(this.URL_API, Subcategory,this.httpOptions);
    } else {
      return null;
    }
  }

  async getSubcategorys() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_subcategory');
    if (perms) {
      return this.http.get<Subcategory[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getSubcategory(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_subcategory');
    if (perms) {
      return this.http.get<Subcategory>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putSubcategory(id:string, Subcategory: Subcategory) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_subcategory');
    if (perms) {
      return this.http.put<Subcategory>(this.URL_API+`/${id}`,Subcategory,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteSubcategory(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_subcategory');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }
}
