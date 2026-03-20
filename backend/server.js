import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 3001

const API_KEY  = process.env.Gemini3_Flash_API || 'sk-BZvkkVrX5P8WnDPRKlcr0iXilfQoxfJtFS1bIJhK5JMlqA9m'
const BASE_URL = 'https://api.tu-zi.com/v1'

app.use(cors())
app.use(express.json({ limit: '2mb' }))

// API 代理
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return res.status(upstream.status).json(data)
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
})

// 托管前端静态文件（生产环境）
const distPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`SDS Generator running → http://localhost:${PORT}`)
})
