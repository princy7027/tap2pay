import dotenv from 'dotenv'
dotenv.config({})

export const NODE_ENV = process.env.NODE_ENV
export const SERVER_PORT = process.env.SERVER_PORT
export const SECRET = process.env.JWT_SECRET
export const APP_NAME = process.env.APP_NAME

export const DB_CONNECION = process.env.DB_CONNECION
