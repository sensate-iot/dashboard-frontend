/*
 * Admin dashboard data model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {TimeSeriesGraphNode} from './timeseries-graph-node.model';

export class AdminDashboard {
  public numberOfUsers : number;
  public numberOfGhosts : number;
  public numberOfSensors : number;
  public measurementStatsLastHour : number;
  public measurementStats : [TimeSeriesGraphNode];
  public registrations : [TimeSeriesGraphNode];
}
