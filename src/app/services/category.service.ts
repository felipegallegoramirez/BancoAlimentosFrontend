import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Category } from "../models/category.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly URL_API = "http://localhost:3000/api/category";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postCategory(Category: Category) {
    const id = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id, 'create_category');
    if (perms) {
      return this.http.post<Category>(this.URL_API, Category,this.httpOptions);
    } else {
      return null;
    }
  }

  async getCategorys() {
    const id = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id, 'read_category');
    if (perms) {
      return this.http.get<Category[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
  }


  async getCategory(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_category');
    if (perms) {
      return this.http.get<Category>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putCategory(id:string, Category: Category) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_category');
    if (perms) {
      return this.http.put<Category>(this.URL_API+`/${id}`,Category,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteCategory(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_category');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
  
}
