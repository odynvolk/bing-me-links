"use strict";

const config = require("exp-config");
const fs = require("fs");
const Log = require("log");
const path = require("path");

function getLoggerStream() {
  if (!config.log) config.log = "stdout";

  switch (config.log) {
    case "file":
      return fs.createWriteStream(path.join(__dirname, "..", "logs", `${config.envName}.log`));
    case "stdout":
      return process.stdout;
    default:
      throw new Error(`Invalid logger: ${config.log}`);
  }
}

module.exports = new Log(config.logLevel || "info", getLoggerStream());
