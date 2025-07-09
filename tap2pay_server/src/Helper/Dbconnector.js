import mongoose from 'mongoose'
import Logger from './Core/Logger.js'

export default async function connectorDB(database) {
  try {
    await mongoose.connect(database) // ✅ No options needed in Mongoose v6+

    Logger.info('Database connection successful.....')
    console.log('Database connection successful.....')

    mongoose.connection.on('disconnected', () => {
      Logger.info('Database disconnected')
      console.log('Db disconnected')
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      process.exit(0)
    })

    return true
  } catch (error) {
    Logger.error('Unable to connect to the db: ' + error.message)
    console.error('Unable to connect to the db:', error.message)
    throw error
  }
}
