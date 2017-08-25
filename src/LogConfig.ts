import {LoggerFactory, LoggerFactoryOptions, LFService, LogGroupRule, LogLevel} from "typescript-logging";

// Create options instance and specify 1 LogGroupRules:
// * One for any logger with a name starting with services, to log on debug
const options = new LoggerFactoryOptions()
 .addLogGroupRule(new LogGroupRule(new RegExp("services.+"), LogLevel.Debug));

// Create a named loggerfactory and pass in the options and export the factory.
// Named is since version 0.2.+ (it's recommended for future usage)
export const factory = LFService.createNamedLoggerFactory("LoggerFactory", options);
