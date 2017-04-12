export interface ApiTalk {
  active: string;
  description: string;
  event_end: string;
  event_start: string;
  event_type: string;
  format: string;
  id: number;
  name: string;
  speakers: string;
  venue: string;
  venue_id: string;
}

export class Talk {

  selected: boolean;
  show_description: boolean;
  day: number;
  index: number;

  active: string;
  name: string;
  event_start: Date;
  event_end: Date;
  format: string;
  venue: string;
  id: number;
  venue_id: number;
  speakers: string[];
  description: string;

}
