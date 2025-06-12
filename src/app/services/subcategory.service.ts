import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Subcategory } from "../models/subcategory.model";

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  readonly URL_API = "http://localhost:3000/api/subcategory";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postSubcategory(Subcategory: Subcategory) {
    return this.http.post<Subcategory>(this.URL_API, Subcategory,this.httpOptions);
  }

  getSubcategorys() {
    return this.http.get<Subcategory[]>(this.URL_API+``,this.httpOptions);
  }


  getSubcategory(id:string) {
    return this.http.get<Subcategory>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putSubcategory(id:string, Subcategory: Subcategory) {
    return this.http.put<Subcategory>(this.URL_API+`/${id}`,Subcategory,this.httpOptions);
  }

  deleteSubcategory(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
}
