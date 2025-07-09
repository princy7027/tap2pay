import * as JWT from '../Helper/Core/JWT.js'
import Logger from "../Helper/Core/Logger.js"
import * as ApiResponse from "../Helper/Core/ApiResponse.js"
import { StatusCodes } from "../Helper/Core/ApiResponse.js"
import User from "../Model/User.js"
import bcrypt from "bcrypt"
import { LoginUserValidation, RegisterUserValidation } from '../Validation/Validation.js'

export const registerUser = async (req, res) => {
  try {
    const userModelValidation = await RegisterUserValidation.validateAsync(req.body)
    const isUsernameAvailable = await User.findOne({
      email: userModelValidation.email,
    })
    if (isUsernameAvailable) {
      Logger.info(`Email ${userModelValidation.email} is already exist`)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse.error(null, ApiResponse.StatusCodes.BAD_REQUEST, `Email ${userModelValidation.email} is already exist`))
    } else {
      const bcryptPassword = await bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(userModelValidation.password, salt))
      const newUser = await User.create({
        email: userModelValidation.email,
        password: bcryptPassword,
      })
      if (newUser) {
        const token = JWT.generateToken(newUser._doc)
        Logger.info('Account register successfully')
        return res
          .status(StatusCodes.CREATED)
          .json(ApiResponse.success({ details: newUser, token }, StatusCodes.CREATED, 'Account register successfully'))
      } else {
        Logger.info('Invalid details provided.')
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(ApiResponse.error(null, StatusCodes.BAD_REQUEST, 'Invalid details provided.'))
      }
    }
  } catch (error) {
    console.log(error)
    Logger.error(error.isJoi === true ? error.details : error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.',
        ),
      )
  }
}

export const loginUser = async (req, res) => {
  try {
    const userModelValidation = await LoginUserValidation.validateAsync(req.body)
    const isUserAvailable = await User.findOne({
      email: userModelValidation.email,
    })
    if (!isUserAvailable) {
      Logger.info(`Email ${userModelValidation.email} is not exist`)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse.error(null, StatusCodes.BAD_REQUEST, `Email ${userModelValidation.email} is not exist`))
    } else {
      const isPasswordMatch = await bcrypt.compare(
        userModelValidation.password,
        isUserAvailable.password,
      )
      if (isPasswordMatch) {
        const token = JWT.generateToken({ _id: isUserAvailable._id })
        Logger.info('Account login successfully')
        return res
          .status(StatusCodes.CREATED)
          .json(ApiResponse.success({ details: isUserAvailable, token }, StatusCodes.CREATED, 'Account login successfully'))
      } else {
        Logger.info('Invalid credential provider')
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(ApiResponse.error(null, StatusCodes.BAD_REQUEST, 'Invalid credential provider'))
      }
    }
  } catch (error) {
    Logger.error(error.isJoi === true ? error.details : error)
    return res
      .status(ApiResponse.StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          ApiResponse.StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.',
        ),
      )
  }
}