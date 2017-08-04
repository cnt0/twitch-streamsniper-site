import { Channel } from './channel';
import { StreamPreview } from './stream-preview';
import { FormatItem } from './format-item';

export class Stream {
  average_fps  : number;
  channel      : Channel;
  created_at   : string;
  delay        : number;
  game         : string;
  preview      : StreamPreview;
  video_height : number;
  viewers      : number;
  formats      : FormatItem[];
};

export class StreamList {
  _total  : number;
  streams : Stream[];
};
