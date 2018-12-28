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

  constructor(public http: HttpClient) {}

  getHome() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/get/home').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  getSearch(query) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/get/search/'+query).subscribe(data => {
        resolve(data); 
      }, err => {
        console.log(err);
      });
    });
  }

  getFilterTypes() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/get/filtered/filters').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFiltered(filterOne, filterTwo) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/get/filtered/'+filterOne+"/"+filterTwo).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getMapsFromCreator(creator) {
      return new Promise(resolve => {
      this.http.get(this.apiUrl+'/get/maps/'+creator).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
