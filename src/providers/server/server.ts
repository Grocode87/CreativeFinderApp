import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  apiUrl = 'http://cgrob10.pythonanywhere.com'
  //apiUrl = 'http://localhost:5000'

  constructor(public http: HttpClient) {}

  getHome() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/get/home?wcollections').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err)
      });
    });
  }
  getSearch(query) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/get/search/'+query).subscribe(data => {
        resolve(data); 
      }, err => {
        reject(err)
      });
    });
  }

  getFilterTypes() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/get/filtered/filters').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err)
      });
    });
  }

  getFiltered(filterOne, filterTwo, time, page) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/get/filtered/'+filterOne+"/"+filterTwo+"/"+time+"/"+page+"?wcollections").subscribe(data => {
        resolve(data);
      }, err => {
        reject(err)
      });
    });
  }

  getMapsFromCreator(map_id, creator, add_to_views) {
      return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/get/details/'+map_id+'/'+creator+'?add_view='+add_to_views).subscribe(data => {
        resolve(data); 
      }, err => {
        reject(err)
      });
    });
  }

    reportMap(map_id, reason) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/report/'+map_id+"/"+reason).subscribe(data => {
        resolve(data); 
      }, err => {
        reject(err)
      });
    });
  }

  getAutocomplete(query) {
      return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl+'/autocomplete/'+query).subscribe(data => {
        resolve(data); 
      }, err => {
        reject(err)
      });
    });
  }
}
