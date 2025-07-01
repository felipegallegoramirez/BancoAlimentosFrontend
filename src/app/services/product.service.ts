import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Product } from "../models/product.model";
import { PermsService } from "./perms.service";



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly URL_API = "http://localhost:3000/api/product";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postProduct(Product: Product) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_product');
    if (perms) {
      return this.http.post<Product>(this.URL_API, Product,this.httpOptions);
    } else {
      return null;
    }
    return this.http.post<Product>(this.URL_API, Product,this.httpOptions);
  }

  async getProducts() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_product');
    if (perms) {
      return this.http.get<Product[]>(this.URL_API+``,this.httpOptions);
    } else {
      return null;
    }
  }


  async getProduct(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_product');
    if (perms) {
      return this.http.get<Product>(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async getProductByCode(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_product');
    if (perms) {
      return this.http.get<Product>(this.URL_API+`/code/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

  async putProduct(id:string, Product: Product) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_product');
    if (perms) {
      return this.http.put(this.URL_API+`/${id}`,Product,this.httpOptions);
    } else {
      return null;
    }
  }

  async deleteProduct(id: string | undefined) {
    if (!id) throw new Error('ID is required');
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_product');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
    } else {
      return null;
    }
  }

}
