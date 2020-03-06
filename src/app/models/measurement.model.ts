/*
 * Measurement model.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export class GeoJSON {
  type: string;
  coordinates: number[];
}

export interface DataPoint {
  unit: string;
  value: number;
  precision?: number;
  accuracy?: number;
}

export interface Measurement {
  timestamp: Date;
  platformTime: Date;
  location: GeoJSON;
  data: Map<string, DataPoint>;
}
