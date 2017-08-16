import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Stream, StreamList } from './stream';

@Injectable()
export class StreamsService {

  constructor(private http: Http) { }

  get_streams(): Observable<StreamList> {
    //return this.http.get('http://localhost:8080/update')
    return this.http.get('/update')
      .map(response => response.json() as StreamList)
  }

  get_formats(display_name: string): Observable<Stream> {
    //return this.http.get("http://localhost:8080/formats?s=" + display_name)
    return this.http.get("/formats?s=" + display_name)
      .map(response => response.json() as Stream)
  }

  play_video(url: string): void {
    this.http.post("/play", { url: url }).subscribe();
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
