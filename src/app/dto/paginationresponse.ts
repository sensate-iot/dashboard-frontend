/*
 * Pagination response type.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {PaginationResult} from './paginationresult';

export class PaginationResponse<TValue> {
  public responseId: string;
  public errors: string[];
  public data: PaginationResult<TValue>;
}
