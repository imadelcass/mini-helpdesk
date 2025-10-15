import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ParamsService {
  flattenParams(obj: any): { [key: string]: any } {
    const flattened: { [key: string]: any } = {};

    const flatten = (obj: any, path: string = '') => {
      for (const key in obj) {
        
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const newPath = path ? `${path}[${key}]` : key;

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            flatten(value, newPath);
          } else {
            flattened[newPath] = value;
          }
        }
      }
    };

    flatten(obj);
    return flattened;
  }

  toHttpParams(obj: any): HttpParams {
    const flattened = this.flattenParams(obj);
    let httpParams = new HttpParams();

    for (const key in flattened) {
      if (flattened.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, flattened[key].toString());
      }
    }

    return httpParams;
  }
}
