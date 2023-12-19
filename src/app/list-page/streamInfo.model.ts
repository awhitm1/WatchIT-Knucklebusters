import { Price } from "./price.model";

export class StreamInfo {
  constructor(
    public service: string,
    public streamingType: string,
    public link: string,
    public quality?: string,
    public price?: Price,
  ){}
}
