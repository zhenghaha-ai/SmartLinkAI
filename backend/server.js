import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app  = express()
const PORT = 3001

const API_KEY  = 'sk-BZvkkVrX5P8WnDPRKlcr0iXilfQoxfJtFS1bIJhK5JMlqA9m'
const BASE_URL = 'https://api.tu-zi.com/v1'

app.use(cors())
app.use(express.json({ limit: '2mb' }))

// 透传 /v1/* → api.tu-zi.com/v1/*
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

app.listen(PORT, () => {
  console.log(`SDS proxy running → http://localhost:${PORT}`)
})
