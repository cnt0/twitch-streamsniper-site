import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Stream, StreamList } from './stream';

@Injectable()
export class StreamsService {

  constructor(private http: Http) { }

  get_streams(): Promise<StreamList> {
    return this.http.get('/update')
      .toPromise()
      .then(response => response.json() as StreamList)
      .catch(this.handleError);
  }

  get_formats(display_name: string): Promise<Stream> {
    return this.http.get("/formats?s=" + display_name)
      .toPromise()
      .then(response => response.json() as Stream)
      .catch(this.handleError);
  }

  play_video(url: string): void {
    this.http.post("/play", { url: url })
      .toPromise()
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
