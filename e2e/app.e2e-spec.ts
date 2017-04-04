import { AgendaPage } from './app.po';

describe('agenda App', () => {
  let page: AgendaPage;

  beforeEach(() => {
    page = new AgendaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
