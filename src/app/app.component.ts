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

  @Input() talks: Talk[];
  differ: any;

  constructor(private talkService: TalkService, private differs: KeyValueDiffers) {
    this.differ = differs.find({}).create(null);
  }

  ngOnInit(): void {
    this.getTalks();
  }

  ngDoCheck() {
    if (typeof(this.talks) === 'undefined') {
      return;
    }

    const selectedTalks = [];
    for (const talk of this.talks) {
      if (talk.selected) {
        selectedTalks.push(talk.id);
      }
    }

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
      this.talks = this.talkService.orderByDateThenVenue(talks);
      this.talkService.fixDates(talks);
      this.talkService.fixSpeakers(talks);
      this.talkService.setDayNumber(talks);
      const selectedTalks = localStorage.getItem(this.savedTalksStorageKey);
      for (const talk of this.talks) {
        if (selectedTalks.indexOf('' + talk.id) > -1) {
          talk.selected = true;
        }
      }
    });
  }

}
