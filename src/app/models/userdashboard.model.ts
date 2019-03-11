/*
 * User dashboard model.
 */

import {DayOfWeekGraphNode, TimeSeriesGraphNode} from './timeseries-graph-node.model';

export class UserDashboard {
  public MeasurementsToday : [TimeSeriesGraphNode];
  public MeasurementsPerDayCumulative : [DayOfWeekGraphNode];
  public ApiCallsLastWeek : [TimeSeriesGraphNode];
  public MeasurementsCumulative : [TimeSeriesGraphNode]

  public SensorCount : number;
  public MeasurementsTodayCount : number;
  public ApiCallCount : number;
  public SecurityTokenCount : number;
}
