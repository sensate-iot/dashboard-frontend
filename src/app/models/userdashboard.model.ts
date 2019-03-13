/*
 * User dashboard model.
 */

import {DayOfWeekGraphNode, TimeSeriesGraphNode} from './timeseries-graph-node.model';

export class UserDashboard {
  public measurementsToday : [TimeSeriesGraphNode];
  public measurementsPerDayCumulative : [DayOfWeekGraphNode];
  public apiCallsLastWeek : [TimeSeriesGraphNode];
  public measurementsCumulative : [TimeSeriesGraphNode]

  public sensorCount : number;
  public measurementsTodayCount : number;
  public apiCallCount : number;
  public securityTokenCount : number;
}
