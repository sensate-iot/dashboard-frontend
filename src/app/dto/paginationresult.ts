/*
 * Pagination result type.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export class PaginationResult<TValue> {
  public count: number;
  public limit: number;
  public skip: number;
  public values: TValue[];
}
