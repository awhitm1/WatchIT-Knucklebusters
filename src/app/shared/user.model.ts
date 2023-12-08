export class User {
  constructor(
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public id?: string,
    public firstName?: string,
    public lastName?: string,
  ) {}

  public get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;

    return this._token
  }

  public set token(token: string) {
    this._token = token;
  }

  public set tokenExpirationDate(expDate: Date) {
    this._tokenExpirationDate = expDate;
  }
}
