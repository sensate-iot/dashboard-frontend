/*
 * Trigger view model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class TriggerAction {
  public channel: number;
  public target: string;
}

export enum TriggerActionChannel {
  Email,
  SMS,
  MQTT,
  HttpPost,
  HttpGet,
  ControlMessage
}

export class TriggerInvocation {
  public id: number;
  public measurementBuckedId: string;
  public measurementId: 0;
  public triggerId: number;
  public timestamp: Date | string;
}

export class Trigger {
  public id: Number;
  public lowerEdge: Number;
  public upperEdge: Number;
  public keyValue: string;
  public sensorId: string;
  public message: string;

  public actions: TriggerAction[];
  public invocations: TriggerInvocation[];
}
