export class TitleDetails {
  constructor(
    public id: number,
    public title: string,
    public runtime: number,
    public releaseDate: string,
    public overview: string,
    public homepage: string,
    public posterImgPath: string,
    public backdropImgPath: string,
    public rating: number
  ){}
}
