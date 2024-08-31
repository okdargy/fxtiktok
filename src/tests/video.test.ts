import app from '@/index'

describe('GET /@i/video/:videoId', () => {
  it('should return 200', async () => {
    const res = await app.request('/@pr4yforgabs/video/7332187682480590112', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
      }
    })

    expect(res.status).toBe(200)
  })

  // no discord user agent, redirects
  it('should return 302', async () => {
    const res = await app.request('/@pr4yforgabs/video/7332187682480590112', {
      method: 'GET'
    })

    expect(res.status).toBe(302)
  })

  it('should return 500', async () => {
    const res = await app.request('/@i/video/123', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
      }
    })

    expect(res.status).toBe(500)
    expect(await res.text()).toContain('An error occurred while trying to fetch data. Please try again later.')
  })
})

// age restricted video
describe('GET /@i/video/:videoId (age restricted)', () => {
  it('should return 200', async () => {
    const res = await app.request('/t/ZP81NmQk9', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
      }
    })

    expect(res.status).toBe(200)
    expect(await res.text()).toContain('⚠️')
  })
})

describe('GET /t/:videoId', () => {
  it('should return 200', async () => {
    const res = await app.request('/t/ZPRKrbUB1', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
      }
    })

    expect(res.status).toBe(200)
  })
})

describe('GET /generate/video/:videoId', () => {
  it('should return 302', async () => {
    const res = await app.request('/generate/video/7332187682480590112', {
      method: 'GET'
    })

    expect(res.status).toBe(302)
  })

  it('should return 500', async () => {
    const res = await app.request('/generate/video/123', {
      method: 'GET'
    })

    expect(res.status).toBe(500)
  })
})
