import { TwitchStreamsniperSitePage } from './app.po';

describe('twitch-streamsniper-site App', () => {
  let page: TwitchStreamsniperSitePage;

  beforeEach(() => {
    page = new TwitchStreamsniperSitePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
