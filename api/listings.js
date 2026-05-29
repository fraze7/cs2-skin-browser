export default async function handler(req, res) {
    const apiKey = process.env.CSFLOAT_API_KEY
    if (!apiKey) {
          return res.status(500).json({ error: 'API key not configured' })
    }

  const params = new URLSearchParams(req.query)
    const url = `https://csfloat.com/api/v1/listings?${params}`

  try {
        const response = await fetch(url, {
                headers: { Authorization: apiKey },
        })
        const data = await response.json()
        if (!response.ok) {
                return res.status(response.status).json(data)
        }
        res.status(200).json(data)
  } catch (err) {
        res.status(500).json({ error: err.message })
  }
}
