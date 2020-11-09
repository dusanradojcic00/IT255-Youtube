import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Video } from '../models/video';
import { map, switchMap } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

export const YOUTUBE_API_KEY =
  'AIzaSyDHC_Og6BqtQoUCzjUvnLr0pnxvRFGed8M';
export const YOUTUBE_API_URL =
  'https://www.googleapis.com/youtube/v3/videos';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  data: Object;
  constructor(private _http: HttpClient,
    @Inject(YOUTUBE_API_KEY) private _apiKey: string,
    @Inject(YOUTUBE_API_URL) private _apiUrl: string) { }

  public getEmbedLink(link) {
    let ID = '';
    link = link.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (link[2] !== undefined) {
      ID = link[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = link;
    }
    return 'https://www.youtube.com/embed/' + ID;
  }

  getVideoDetails(id: string): Video {
    let video = new Video("", "", "https://www.youtube.com/embed/" + id);
    const params: string = [
      `id=${id}`,
      `part=snippet`,
      `key=${this._apiKey}`,
    ].join('&');
    const queryUrl = `${this._apiUrl}?${params}`;
    this._http.get(queryUrl).subscribe((data: any) => {
      video.title = data.items[0].snippet.title;
      video.description = data.items[0].snippet.description;
    });
    return video;
  }
}


