/*
 * Audit log model.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

export enum RequestMethod
{
  HttpGet,
  HttpPost,
  HttpPatch,
  HttpPut,
  HttpDelete,

  WebSocket,

  MqttTcp,
  MqttWebSocket,
  Any
}

export interface AuditLog {
  id: number,
  route: string,
  method: RequestMethod,
  address: string,
  email: string,
  timestamp: Date
}
