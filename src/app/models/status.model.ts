/*
 * Status code model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class Status {
    errorCode : Number;
    message: String;
}

export class StatusCode {
  public static badInput = 400;
  public static notAllowed = 401;
  public static notFound = 402;
  public static Banned = 403;
  public static Ok = 200;
}
