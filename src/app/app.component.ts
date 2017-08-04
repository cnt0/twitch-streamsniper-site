import { Component, OnInit } from '@angular/core';

import { Stream, StreamList } from './stream';
import { StreamsService } from './streams.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private streamsService: StreamsService) { }

  title = 'app';
  streams: StreamList;

  ngOnInit() : void {
    this.streamsService.get_streams().then(s => this.streams = s);
  }
}
