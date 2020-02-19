/*
 * Query builder interface.
 *
 * @author Michel Megens
 * @mail   michel@michelmegens.net
 */

import {Sensor} from '../../models/sensor.model';

export interface IQueryBuilderInterface {
  sensors: Sensor[];
  sensor: string;
  start: Date;
  end: Date;
  longitude: number;
  latitude: number;
  geoQuery: boolean;
  max: number;
  skip: number;
  limit: number;
}
