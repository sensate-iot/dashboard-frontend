/*
 * HTTP response.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export class Response<TValue> {
  public responseId: string;
  public errors: string[];
  public data: TValue;
}
