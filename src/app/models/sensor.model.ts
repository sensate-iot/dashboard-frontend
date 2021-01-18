/*
 * Sensor model.
 */

export class Sensor {
  public id: string;
  public secret: string;
  public name: string;
  public description: string;
  public storageEnabled: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public owner: string;
}
