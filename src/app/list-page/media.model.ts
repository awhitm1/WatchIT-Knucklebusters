import { StreamInfo } from "./streamInfo.model";

export class Media {
  constructor(
    public title: string,
    public year: number,
    public service: StreamInfo,
    public imdbId: string,
    public tmdbId: number,
    public type: string,
    public status?: string,
    public serviceOptions?: StreamInfo[]
  ){}
}
