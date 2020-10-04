"use strict";
/*
 * Status code model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */
exports.__esModule = true;
exports.StatusCode = exports.Status = void 0;
var Status = /** @class */ (function () {
    function Status() {
    }
    return Status;
}());
exports.Status = Status;
var StatusCode = /** @class */ (function () {
    function StatusCode() {
    }
    StatusCode.badInput = 400;
    StatusCode.notAllowed = 401;
    StatusCode.notFound = 402;
    StatusCode.Banned = 403;
    StatusCode.Ok = 200;
    return StatusCode;
}());
exports.StatusCode = StatusCode;
