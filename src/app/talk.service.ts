import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { ApiTalk, Talk } from './talk';

import * as storage from 'localforage';

import 'rxjs/add/operator/toPromise';

const STORAGE_KEY = 'talks';
const START_DAY = 3;
const TALKS_API_URL = 'https://api.cfp.io/api/schedule';
const TIME_ZONE_DIFFERENCE_BETWEEN_UTC_AND_CET = 2;

const comparator = {
  talk(current: ApiTalk, next: ApiTalk) {
    if (current.event_start > next.event_start) {
      return 1;
    }
    if (current.event_start < next.event_start) {
      return -1;
    }
    if (current.venue > next.venue) {
      return 1;
    }
    if (current.venue < next.venue) {
      return -1;
    }
    return 0;
  }
};

@Injectable()
export class TalkService {

  constructor(private http: Http) { }

  getTalks(): Promise<Talk[]> {
    return storage.getItem(STORAGE_KEY).then(talks => talks || this.fetch())
  }

  private fetch(): Promise<Talk[]> {
    const headers = new Headers({'X-Tenant-Id': 'breizhcamp'});
    return this.http.get(TALKS_API_URL, { headers })
               .toPromise()
               .then(response => response.json() as ApiTalk[])
               .then(talks => this.normalize(talks))
               .then(talks => this.persist(talks))
               .catch(error => Promise.reject(error.message || error));
  }

  private persist(talks: Talk[]): Promise<Talk[]> {
    return storage.setItem(STORAGE_KEY, talks);
  }

  private normalize(talks: ApiTalk[]): Talk[] {
    return talks.sort(comparator.talk).map((talk, index) => {
      const event_start = new Date(talk.event_start);
      event_start.setHours(event_start.getHours() - TIME_ZONE_DIFFERENCE_BETWEEN_UTC_AND_CET);

      const event_end = new Date(talk.event_end);
      event_end.setHours(event_end.getHours() - TIME_ZONE_DIFFERENCE_BETWEEN_UTC_AND_CET);

      const day = event_start.getDay() - START_DAY;

      const speakers = talk.speakers.split(',').filter(speaker => speaker && speaker.trim() &&
                                                       speaker.trim().indexOf('null') !== 0);

      return {
        ...talk,
        index,
        day,
        show_description: false,
        selected: false,
        speakers,
        event_start,
        event_end,
        venue_id: parseInt(talk.venue_id, 10)
      };
    });
  }

}
