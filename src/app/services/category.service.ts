import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Category } from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly URL_API = "http://localhost:3000/api/category";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postCategory(Category: Category) {
    return this.http.post<Category>(this.URL_API, Category,this.httpOptions);
  }

  getCategorys() {
    return this.http.get<Category[]>(this.URL_API+``,this.httpOptions);
  }


  getCategory(id:string) {
    return this.http.get<Category>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putCategory(id:string, Category: Category) {
    return this.http.put<Category>(this.URL_API+`/${id}`,Category,this.httpOptions);
  }

  deleteCategory(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
  
}
