export class Base64 {
  public static encode(str: string): string {
    return btoa(str);
  }

  public static decode(str: string): string {
    return atob(str);
  }

  public static validate(str: string): boolean {
    return /^[A-Za-z0-9\-_]+$/.test(str);
  }
}
