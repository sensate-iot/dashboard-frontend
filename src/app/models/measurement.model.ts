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

export class DataPoint {
  unit: string;
  value: number;
  precision: number;
  accuracy: number;
}

export class Measurement {
  timestamp: Date;
  location: GeoJSON;
  data: Map<string, DataPoint>;
}
