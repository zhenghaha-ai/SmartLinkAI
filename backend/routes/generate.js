import express from 'express'
import { generateSdsContent } from '../services/claude.js'
import { buildDocx } from '../services/docxBuilder.js'

const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    const formData = req.body
    if (!formData.productName) {
      return res.status(400).json({ error: '产品名称为必填项' })
    }

    const sdsJson = await generateSdsContent(formData)
    const docxBuffer = await buildDocx(sdsJson, formData)

    const filename = `SDS_${formData.productName.replace(/\s+/g, '_')}.docx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    res.send(docxBuffer)
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ error: err.message || '生成失败，请重试' })
  }
})

export default router
