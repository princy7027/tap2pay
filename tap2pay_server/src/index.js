import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import connectorDB from './Helper/Dbconnector.js'
import indexRoutes from './Routes/Index.js'
import { fraudDetection } from './Middleware/fraudDetection.js' // ✅ Import middleware

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }))
app.use(bodyParser.json({ limit: '200mb' }))

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// 🧪 Test Route to check fraud detection
app.get('/api/test-fraud', fraudDetection, (req, res) => {
  res.json({ message: '✅ Passed fraud detection check' })
})

// Basic health route
app.get('/', (req, res) => {
  res.send('Hello World from Express!')
})

// ✅ Apply routes
app.use('/api/v1', indexRoutes)

// DB connect + Start server
;(async () => {
  try {
    const dbConnectionString = process.env.DB_CONNECTION ?? ''
    await connectorDB(dbConnectionString)

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  }
})()
