import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Donor } from "../models/donor.model";
import { PermsService } from "./perms.service";

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  readonly URL_API = "http://localhost:3000/api/donor";
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private permsService: PermsService) {
  }

  
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })
  };


  async postDonor(Donor: Donor) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'create_donor');
    if (perms) {
      return this.http.post<Donor>(this.URL_API, Donor,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async getDonors() {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_donor');
    if (perms) {
      return this.http.get<Donor[]>(this.URL_API+``,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }


  async getDonor(id:string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'read_donor');
    if (perms) {
      return this.http.get<Donor>(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async putDonor(id:string, Donor: Donor) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'edit_donor');
    if (perms) {
      return this.http.put<Donor>(this.URL_API+`/${id}`,Donor,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }

  async deleteDonor(id: string) {
    const id_user = localStorage.getItem('id');
    const perms = await this.permsService.getPerms(id_user, 'delete_donor');
    if (perms) {
      return this.http.delete(this.URL_API+`/${id}`,this.httpOptions).toPromise();
    } else {
      return null;
    }
  }
}
