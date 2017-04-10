import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Talk } from './talk';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TalkService {

  private headers = new Headers({'X-Tenant-Id': 'breizhcamp'});
  private urlTalks = 'https://api.cfp.io/api/schedule';

  constructor(private http: Http) { }

  getTalks(): Promise<Talk[]> {
    return this.http.get(this.urlTalks, {headers: this.headers})
               .toPromise()
               .then(response => response.json() as Talk[])
               .catch(this.handleError);
  }

  orderByDateThenVenue(talks: Talk[]): Talk[] {
    talks.sort((n1, n2) => {
      if (n1.event_start > n2.event_start) {
        return 1;
      }
      if (n1.event_start < n2.event_start) {
        return -1;
      }
      if (n1.venue > n2.venue) {
        return 1;
      }
      if (n1.venue < n2.venue) {
        return -1;
      }
      return 0;
    });

    // Set index
    for (let i = 0; i < talks.length; ++i) {
      talks[i].index = i + 1;
    }

    return talks;
  }

  fixDates(talks: Talk[]): void {
    const timeZoneDifferenceBetweenUTCAndCET = 2;

    for (let i = 0; i < talks.length; ++i) {
      const date1 = new Date(talks[i].event_start);
      date1.setHours(date1.getHours() - timeZoneDifferenceBetweenUTCAndCET);
      talks[i].event_start = date1;

      const date2 = new Date(talks[i].event_end);
      date2.setHours(date2.getHours() - timeZoneDifferenceBetweenUTCAndCET);
      talks[i].event_end = date2;
    }
  }

  fixSpeakers(talks: Talk[]): void {
    for (let i = 0; i < talks.length; ++i) {
      const talk = talks[i];
      const speakers = talk.speakers.split(',');
      const fixedSpeakers = [];
      for (let n = 0; n < speakers.length; ++n) {
        const speaker = speakers[n].trim();
        if (speaker.length > 0 && speaker.indexOf('null') !== 0) {
          fixedSpeakers.push(speaker);
        }
      }
      talk.speakers = fixedSpeakers.join(', ');
    }

  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
