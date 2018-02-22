import { Component } from "react";
import { render } from "react-dom";

import { observer } from "mobx-react";
import { applySnapshot, applyPatch, flow, types } from "mobx-state-tree";

const HOST = "http://localhost:8080";

let timeout1 = (t) => new Promise((resolve, reject) => {
  let wait = setTimeout(() => {
    clearTimeout(wait);
    reject("timeout " + t);
  }, t);
});

const Channel = types.model({
  broadcaster_language : "",
  created_at           : "",
  display_name         : "",
  followers            : 0,
  game                 : "",
  language             : "",
  logo                 : "",
  name                 : "",
  profile_banner       : "",
  status               : "",
  updated_at           : "",
  url                  : "",
  video_banner         : "",
  views                : 0,
});

const FormatItem = types.model({
  format: "",
  url: "",
});

const StreamPreview = types.model({
  large: "",
  medium: "",
  small: "",
  template: "",
});

const Stream = types.model({
  average_fps  : 0,
  channel      : types.maybe(Channel),
  created_at   : "",
  delay        : 0,
  game         : "",
  preview      : types.maybe(StreamPreview),
  video_height : 0,
  viewers      : 0,
  formats      : types.maybe(types.array(FormatItem)),

  updating: false,
}).actions(self => ({
  updateFormats: flow(function* updateFormats() {
    applyPatch(self, { op: "replace", path: "updating", value: true });
    try {
      let newSelf = yield Promise.race([
        fetch(self.updateRequest).then(r => r.json()),
        timeout1(10000),
      ]);
      applySnapshot(self, newSelf);
    } catch (e) {
      console.log("error:", e);
      applyPatch(self, { op: "replace", path: "updating", value: false });
    }
  }),
  playVideo: flow(function* playVideo(url) {
    // ToDo: add state change just like in updateFormats
    try {
      yield fetch(self.playRequest(url));
    } catch (e) {
      console.log("error:", e);
    }
  })
})).views(self => ({
  get updateRequest() {
    let url = new URL(`${HOST}/formats`);
    url.searchParams.append("s", self.channel.display_name);
    return new Request(url);
  },
  playRequest(url) {
    let requestOptions = { 
      method: "POST", 
      body: JSON.stringify({ url: url }) 
    };
    return new Request(`${HOST}/play`, requestOptions);
  },
  clipURL(url) {
    let fakeElement = document.createElement('textarea');
    fakeElement.style.position = 'fixed';
    fakeElement.style.top = '100%';
    fakeElement.readOnly = true;
    fakeElement.value = url;
    document.body.appendChild(fakeElement);
    fakeElement.select();
    document.execCommand('copy');
    document.body.removeChild(fakeElement);
  }
}));

const StreamList = types.model({
  _total: 0,
  streams: types.optional(types.array(Stream), []),
});

const Store = types.model({
  stream_list: types.optional(StreamList, {}),
}).actions(self => ({
  update: flow(function* update() {
    let newStreamList = yield Promise.race([
      fetch(self.updateRequest).then(r => r.json()),
      timeout1(10000),
    ]);
    self.stream_list = newStreamList;
  })
})).views(self => ({
  get updateRequest() {
    return new Request(`${HOST}/update`);
  }
}));

const StreamC = observer(class StreamC extends Component {

  renderUpdateBtn() {

    if (this.props.stream.updating) {
      return <span className="updateBtn updating">please wait...</span>;
    }
    return <span className="updateBtn" 
                 onClick={ this.props.stream.updateFormats }>
                 Update formats
           </span>;
  }

  renderFormat(format, idx) {
    return (
      <li key={`${this.props.stream.channel.display_name}${idx}`}>
        <span className="playBtn" onClick={ () => this.props.stream.playVideo(format.url) }>Play!</span>
        <span className="playBtn" onClick={ () => this.props.stream.clipURL(format.url) }>Clip!</span>
        <a href={format.url} target="_blank">{ format.format }</a>
      </li>
    );
  }

  renderFormats() {
    if (this.props.stream.formats) {
      return (
        <ul>{ this.props.stream.formats.map(this.renderFormat.bind(this)) }</ul>
      );
    }
    return "";
  }

  render() {
    return (
      <div className="stream">
        <div className="streamImg">
          <img src={ this.props.stream.preview.medium }/>
        </div>
        <div className="streamData">
          { this.renderUpdateBtn() }
          <a className="streamUrl" 
             href={ this.props.stream.channel.url }>
             { this.props.stream.channel.display_name }
          </a>
          <i> { this.props.stream.channel.status } ({ this.props.stream.viewers } viewers)</i>
          { this.renderFormats() }
        </div>         
      </div>
    );
  }
})

const StreamListC = observer(class StreamListC extends Component {

  renderStream(stream, idx) {
    return <li key={`stream${idx}`}><StreamC stream={ stream }/></li>;
  }

  render() {
    return (
      <ul>{ this.props.streamList.streams.map(this.renderStream) }</ul>
    );
  }
})

const App = observer(class App extends Component {
  render() {
    return <StreamListC streamList={ this.props.store.stream_list }/>;
  }
})

let store = Store.create();
store.update();
const element = <App store={ store } />;
const node = document.getElementById('content');

render(element, node);
