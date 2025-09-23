import { connect } from 'mongoose'
import { MONGO_URI } from './config.js'


export const connectDatabase = async ()=>{
  try {
    await connect(MONGO_URI)
    console.log('✅ Database connection successful')
  } catch (error) {
    console.log('Error connecting to database: ', error)
    process.exit(1)
  }
}
