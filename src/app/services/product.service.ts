import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Product } from "../models/product.model";



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly URL_API = "http://localhost:3000/api/product";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postProduct(Product: Product) {
    return this.http.post<Product>(this.URL_API, Product,this.httpOptions);
  }

  getProducts() {
    return this.http.get<Product[]>(this.URL_API+``,this.httpOptions);
  }


  getProduct(id:string) {
    return this.http.get<Product>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putProduct(id:string, Product: Product) {
    return this.http.put(this.URL_API+`/${id}`,Product,this.httpOptions);
  }

  deleteProduct(id: string | undefined) {
    if (!id) throw new Error('ID is required');
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }

}
