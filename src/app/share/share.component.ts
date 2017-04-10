import { Component, Input, OnInit } from '@angular/core';
import { Talk } from '../talk';
import { TalkService } from '../talk.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['../app.component.scss']
})
export class ShareComponent implements OnInit {

  showSelectedOnly = true;
  showTalkDescriptions = false;

  @Input() talks: Talk[];

  constructor(private talkService: TalkService) {
  }

  ngOnInit(): void {
    this.getTalks();
  }

  getTalks(): void {
    this.talkService.getTalks().then(talks => {
      this.talks = this.talkService.orderByDateThenVenue(talks);
      this.talkService.fixDates(talks);
      this.talkService.fixSpeakers(talks);
      const selectedTalks = location.hash + ',';
      for (const talk of this.talks) {
        if (selectedTalks.indexOf(talk.id + ',') > -1) {
          talk.selected = true;
        }
      }
    });
  }

}
