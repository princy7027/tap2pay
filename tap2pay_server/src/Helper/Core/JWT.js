import jwt from 'jsonwebtoken'; // default import from CommonJS
const { sign, verify } = jwt;
import { StatusCodes } from './ApiResponse.js'
import * as ApiResponse from './ApiResponse.js'
import { SECRET } from './Config.js'
import User from '../../Model/User.js'
import Logger from './Logger.js'

const secretKey = SECRET || '123456789'

export const generateToken = (user) => {
  const token = sign(user, secretKey, { expiresIn: '30 days' })
  return token
}

export const compareToken = (user) => {
  const decoded = verify(user, secretKey)
  return decoded
}

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.toString() ?? ''
    const decoded = verify(token, secretKey)
    console.log(decoded)
    if (decoded) {
      const userFound = await User.findOne({ _id: decoded._id })
      if (userFound) {
        req.headers['userId'] = userFound._id
        return next()
      } else {
        Logger.info(`User not found`)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(ApiResponse.error([], StatusCodes.UNAUTHORIZED, 'User not found'))
      }
    } else {
      Logger.info(`Invalid token`)
      return res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.error([], StatusCodes.UNAUTHORIZED, 'my errror'))
    }
  } catch (error) {
    Logger.error(error.message)
    return res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.error(error, res.statusCode))
  }
}
