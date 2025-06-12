import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Provider } from "../models/provider.model";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  readonly URL_API = "http://localhost:3000/api/provider";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  postProvider(Provider: Provider) {
    return this.http.post<Provider>(this.URL_API, Provider,this.httpOptions);
  }

  getProviders() {
    return this.http.get<Provider[]>(this.URL_API+``,this.httpOptions);
  }


  getProvider(id:string) {
    return this.http.get<Provider>(this.URL_API+`/${id}`,this.httpOptions);
  }

  putProvider(id:string, Provider: Provider) {
    return this.http.put<Provider>(this.URL_API+`/${id}`,Provider,this.httpOptions);
  }

  deleteProvider(id: string) {
    return this.http.delete(this.URL_API+`/${id}`,this.httpOptions);
  }
}
