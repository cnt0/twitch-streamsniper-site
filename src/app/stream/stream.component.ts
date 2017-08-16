import { Component, Input } from '@angular/core';

import { Stream, StreamList } from '../stream';
import { StreamsService } from '../streams.service';

@Component({
  selector: 'stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent {

  constructor(private streamsService: StreamsService) { }
  @Input() stream: Stream;
  updating: boolean = false;

  get_formats(): void {
    this.updating = true;
    this.streamsService.get_formats(this.stream.channel.display_name)
      .subscribe(s => {
        this.stream = s as Stream;
        this.updating = false;
      });
  }

  play_video(url: string): void {
    this.streamsService.play_video(url);
  }

  clip(text: string): void {
    let fakeElement = document.createElement('textarea');
    fakeElement.style.position = 'fixed';
    fakeElement.style.top = '100%';
    fakeElement.readOnly = true;
    fakeElement.value = text;
    document.body.appendChild(fakeElement);
    fakeElement.select();
    document.execCommand('copy');
    document.body.removeChild(fakeElement);
  }
}
