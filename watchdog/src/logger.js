import * as loglevel from "loglevel";
import * as config from "./config";

if (config.isProd()) {
    loglevel.setLevel(loglevel.levels.WARN);
}
else {
    loglevel.setLevel(loglevel.levels.TRACE);
}

export * from "loglevel";