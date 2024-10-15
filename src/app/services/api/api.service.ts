import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient
  ) { }

  getFiles(words: string): Observable<any> {
    return this.http.get(`http://localhost:3000/search?word=${words.split(' ').join('_')}`)
  }

  getFileInfo(fileName: string): Observable<any> {
    return this.http.get(`http://localhost:3000/file-data?fileName=${fileName}`)
  }
}
