import { Component, Input, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { Talk } from './talk';
import { TalkService } from './talk.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {

  readonly savedTalksStorageKey = 'saved_talks';
  readonly savedDayShown = 'saved_day_shown';

  showSelectedOnly = false;
  showTalkDescriptions = false;
  showSharePanel = false;
  showDays: Array<boolean> = [true, true, true];
  shareUrl = '';
  shareUrlForQRCode = '';
  isSecuredURLScheme: boolean;

  @Input() talks: Talk[];
  differ: any;

  constructor(private talkService: TalkService, private differs: KeyValueDiffers) {
    this.differ = differs.find({}).create(null);
    this.isSecuredURLScheme = location.protocol.indexOf('https') === 0;
  }

  ngOnInit(): void {
    this.getTalks();
  }

  ngDoCheck() {
    if (typeof(this.talks) === 'undefined') {
      return;
    }

    const selectedTalks = this.talks.filter(talk => talk.selected).map(talk => talk.id);

    const changes = this.differ.diff(selectedTalks);
    if (changes) {
      const selectedTalksString = selectedTalks.join(',');
      localStorage.setItem(this.savedTalksStorageKey, selectedTalksString);
      this.shareUrl = location.href + 'share#' + selectedTalksString;
      this.shareUrlForQRCode = location.href + 'share%23' + selectedTalksString;
    }
  }

  getTalks(): void {
    this.talkService.getTalks().then(talks => {
      this.talks = talks;
      const selectedTalks = localStorage.getItem(this.savedTalksStorageKey);
      this.talks.forEach(talk => {
        if (selectedTalks && selectedTalks.indexOf('' + talk.id) > -1) {
          talk.selected = true;
        }
      });
    });
  }

  buildSecuredSchemeURL(): string {
    return location.href.replace('http://', 'https://');
  }

}
