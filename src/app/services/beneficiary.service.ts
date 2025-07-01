import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Beneficiary } from "../models/beneficiary.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  readonly URL_API = "http://localhost:3000/api/beneficiary";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postBeneficiary(Beneficiary: Beneficiary) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_beneficiary');
    if (perms) {
      return this.http.post<Beneficiary>(this.URL_API, Beneficiary,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async getBeneficiarys() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_beneficiary');
    if (perms) {
      return this.http.get<Beneficiary[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getBeneficiary(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_beneficiary');
    if (perms) {
      return this.http.get<Beneficiary>(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async putBeneficiary(id:string, Beneficiary: Beneficiary) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_beneficiary');
    if (perms) {
      return this.http.put<Beneficiary>(this.URL_API+`/${id}`,Beneficiary,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async deleteBeneficiary(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_beneficiary');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }
}
