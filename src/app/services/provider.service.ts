import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Provider } from "../models/provider.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  readonly URL_API = "http://localhost:3000/api/provider";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postProvider(Provider: Provider) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_provider');
    if (perms) {
      return this.http.post<Provider>(this.URL_API, Provider,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async getProviders() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_provider');
    if (perms) {
      return this.http.get<Provider[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getProvider(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_provider');
    if (perms) {
      return this.http.get<Provider>(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async putProvider(id:string, Provider: Provider) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_provider');
    if (perms) {
      return this.http.put<Provider>(this.URL_API+`/${id}`,Provider,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async deleteProvider(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_provider');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }
}
