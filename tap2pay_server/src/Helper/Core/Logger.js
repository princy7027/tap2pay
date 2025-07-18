import { createLogger, transports, format } from 'winston'
import fs from 'fs'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'
import { NODE_ENV } from './Config.js'

let dir = 'logs'
if (!dir) dir = path.resolve('logs')

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir)
}

const logLevel = NODE_ENV === 'development' ? 'debug' : 'warn'

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  filename: dir + '/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
})

export default createLogger({
  transports: [
    new transports.Console(),
    new transports.Console({
      level: logLevel,
      format: format.combine(format.errors({ stack: true }), format.prettyPrint()),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false, // do not exit on handled exceptions
})
