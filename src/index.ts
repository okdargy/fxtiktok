import { Hono } from 'hono'
import { cache } from 'hono/cache'

import { scrapeLiveData, scrapeShopData, scrapeVideoData } from './services/tiktok'
import { grabAwemeId } from './services/tiktok'
import { VideoResponse, ErrorResponse, LiveResponse, WarningResponse, ShopResponse } from './templates'
import generateAlternate from './util/generateAlternate'
import { returnHTMLResponse } from './util/responseHelper'

const app = new Hono()
const awemeIdPattern = /^\d{1,19}$/
const awemeLinkPattern = /\/@([\w\d_.]+)\/(video|photo|live)\/?(\d{19})?/

// Credit: https://github.com/FixTweet/FxTwitter/blob/b6564868719473f926c4e7e28ec95059506f69e2/src/constants.ts#L24
const BOT_REGEX =
  /bot|facebook|embed|got|firefox\/92|firefox\/38|curl|wget|go-http|yahoo|generator|whatsapp|revoltchat|preview|link|proxy|vkshare|images|analyzer|index|crawl|spider|python|cfnetwork|node|mastodon|http\.rb|ruby|bun\/|fiddler|iframely|steamchaturllookup/i

app.get('/test/video/:videoId', async (c) => {
  const { videoId } = c.req.param()

  try {
    const videoData = await scrapeVideoData(videoId)

    return new Response(JSON.stringify(videoData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  }
})

app.get('/', (c) => {
  return new Response('', {
    status: 302,
    headers: {
      Location: 'https://github.com/okdargy/fxtiktok'
    }
  })
})

async function handleShort(c: any): Promise<Response> {
  const { videoId } = c.req.param()
  let id = videoId.split('.')[0] // for .mp4, .webp, etc.

  // First, we need to find where the vm link goes to
  const res = await fetch('https://vm.tiktok.com/' + id)
  const link = new URL(res.url)

  // Clean any tracking parameters
  link.search = ''

  // If the user agent is a bot, redirect to the TikTok page
  if (!BOT_REGEX.test(c.req.header('User-Agent') || '')) {
    return new Response('', {
      status: 302,
      headers: {
        Location: 'https://www.tiktok.com' + link.pathname
      }
    })
  }

  // Now, we need to check if the video is a livestream or a photo/video
  if (link.pathname.includes('/video') || link.pathname.includes('/photo')) {
    return handleVideo(c)
  } else if (link.pathname.includes('/live')) {
    return handleLive(c)
  } else {
    const responseContent = await ErrorResponse('Invalid vm link')
    return returnHTMLResponse(responseContent, 400)
  }
}

async function handleVideo(c: any): Promise<Response> {
  const { videoId } = c.req.param()
  let id = videoId.split('.')[0] // for .mp4, .webp, etc.

  // If the user agent is a bot, redirect to the TikTok page
  if (!BOT_REGEX.test(c.req.header('User-Agent') || '')) {
    const url = new URL(c.req.url)

    // Remove tracking parameters
    url.search = ''

    return new Response('', {
      status: 302,
      headers: {
        Location: 'https://www.tiktok.com' + url.pathname
      }
    })
  }

  if (!awemeIdPattern.test(id)) {
    const url = await grabAwemeId(id)
    const match = url.pathname.match(awemeLinkPattern)

    if (match) {
      id = match[3]
    } else {
      const responseContent = await ErrorResponse('Invalid video ID')
      return returnHTMLResponse(responseContent, 400)
    }
  }

  try {
    const videoInfo = await scrapeVideoData(id)

    if (videoInfo instanceof Error) {
      const responseContent = await ErrorResponse((videoInfo as Error).message)
      return returnHTMLResponse(responseContent, 500)
    }

    const url = new URL(c.req.url)
    const extensions = ['mp4', 'png', 'jpg', 'jpeg', 'webp', 'webm']

    if (
      url.hostname.includes('d.tnktok.com') ||
      c.req.query('isDirect') === 'true' ||
      extensions.some((suffix) => c.req.path.endsWith(suffix))
    ) {
      if (videoInfo.video.duration > 0) {
        return new Response('', {
          status: 302,
          headers: {
            Location: 'https://fxtiktok-rewrite.dargy.workers.dev/generate/video/' + videoInfo.id
          }
        })
      } else {
        return new Response('', {
          status: 302,
          headers: {
            Location: 'https://fxtiktok-rewrite.dargy.workers.dev/generate/image/' + videoInfo.id
          }
        })
      }
    } else {
      if (videoInfo.isContentClassified === true) {
        const responseContent = await WarningResponse('Sensitive Content', 'the video being age-restricted')
        return returnHTMLResponse(responseContent, 200)
      }

      const responseContent = await VideoResponse(videoInfo)
      return returnHTMLResponse(responseContent)
    }
  } catch (e) {
    const responseContent = await ErrorResponse((e as Error).message)
    return returnHTMLResponse(responseContent, 500)
  }
}

async function handleLive(c: any): Promise<Response> {
  const { author, videoId } = c.req.param()
  let authorName = author

  // If the user agent is a bot, redirect to the TikTok page
  if (!BOT_REGEX.test(c.req.header('User-Agent') || '')) {
    const url = new URL(c.req.url)

    // Remove tracking parameters
    url.search = ''

    return new Response('', {
      status: 302,
      headers: {
        Location: 'https://www.tiktok.com' + url.pathname
      }
    })
  }

  if (!author && !awemeIdPattern.test(videoId)) {
    const url = await grabAwemeId(videoId)
    const match = url.pathname.match(awemeLinkPattern)

    if (match) {
      authorName = match[1]
    } else {
      const responseContent = await ErrorResponse('Invalid live ID')
      return returnHTMLResponse(responseContent, 400)
    }
  }

  authorName = authorName.startsWith('@') ? authorName.substring(1) : authorName

  try {
    const liveData = await scrapeLiveData(authorName)

    if (liveData instanceof Error) {
      const responseContent = await ErrorResponse((liveData as Error).message)
      return returnHTMLResponse(responseContent, 500)
    }

    const responseContent = await LiveResponse(liveData)
    return returnHTMLResponse(responseContent)
  } catch (e) {
    const responseContent = await ErrorResponse((e as Error).message)
    return returnHTMLResponse(responseContent, 500)
  }
}

async function handleShop(c: any): Promise<Response> {
  const { shopId } = c.req.param()

  if (!BOT_REGEX.test(c.req.header('User-Agent') || '')) {
    const url = new URL(c.req.url)

    // Remove tracking parameters
    url.search = ''

    return new Response('', {
      status: 302,
      headers: {
        Location: 'https://www.tiktok.com' + url.pathname
      }
    })
  }

  try {
    const shopData = await scrapeShopData(shopId)

    if (shopData instanceof Error) {
      const responseContent = await ErrorResponse((shopData as Error).message)
      return returnHTMLResponse(responseContent, 500)
    }

    const responseContent = await ShopResponse(shopData)
    return returnHTMLResponse(responseContent)
  } catch (e) {
    const responseContent = await ErrorResponse((e as Error).message)
    return returnHTMLResponse(responseContent, 500)
  }
}

app.get('/generate/alternate', (c) => {
  const content = JSON.stringify(generateAlternate(c))
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

app.get('/generate/video/:videoId', async (c) => {
  const { videoId } = c.req.param()
  const forceLow =
    c.req.query('h264') === 'true' || c.req.query('encoder') === 'h264' || c.req.query('quality') === 'h264'

  try {
    // To ensure the video is valid, decrease load on TikWM by checking the video data first
    const data = await scrapeVideoData(videoId)

    if (data instanceof Error) {
      return new Response((data as Error).message, {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    }

    const highAvailable = data.video.bitrateInfo.find((bitrate) => bitrate.CodecType.includes('h265'))

    if (highAvailable && !forceLow) {
      return c.redirect(`https://tikwm.com/video/media/hdplay/${videoId}.mp4`)
    } else {
      return c.redirect(`https://tikwm.com/video/media/play/${videoId}.mp4`)
    }
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
})

app.get('/generate/image/:videoId', async (c) => {
  const { videoId } = c.req.param()
  const index = c.req.query('index') || 0

  if (!videoId) return new Response('Missing video ID', { status: 400 })
  if (!awemeIdPattern.test(videoId)) return new Response('Invalid video ID', { status: 400 })
  if (isNaN(Number(index))) return new Response('Invalid image index', { status: 400 })

  try {
    const data = await scrapeVideoData(videoId)

    if ('imagePost' in data && data.imagePost.images.length > 0 && +index < data.imagePost.images.length) {
      return c.redirect(data.imagePost.images[+index].imageURL.urlList[0])
    } else {
      throw new Error('Image not found')
    }
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
})

app.get('/generate/image/:videoId/:imageCount', async (c) => {
  const { videoId, imageCount } = c.req.param()

  if (!videoId) return new Response('Missing video ID', { status: 400 })
  if (!awemeIdPattern.test(videoId)) return new Response('Invalid video ID', { status: 400 })

  if (isNaN(Number(imageCount)) || parseInt(imageCount) < 1) return new Response('Invalid image count', { status: 400 })
  const imageIndex = parseInt(imageCount) - 1 // 0-indexed

  try {
    const data = await scrapeVideoData(videoId)

    const images = await fetch('https://tikwm.com/api/', {
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'url=' + videoId + '&count=12&cursor=0&web=1&hd=1',
      method: 'POST'
    })

    const imageJson = (await images.json()) as { data: { images: string[] } }
    if (!imageJson.data.images[imageIndex]) return new Response('Image not found', { status: 404 })

    return c.redirect(imageJson.data.images[imageIndex])
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
})

app.get('/generate/livePic/:author', async (c) => {
  const { author } = c.req.param()

  try {
    const data = await scrapeLiveData(author)

    if (data instanceof Error) {
      return new Response((data as Error).message, {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    }

    return c.redirect(data.liveRoomUserInfo.user.avatarLarger)
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
})

const routes = [
  {
    path: '/:videoId',
    handler: handleShort
  },
  {
    path: '/t/:videoId',
    handler: handleShort
  },
  {
    path: '/*/video/:videoId',
    handler: handleVideo
  },
  {
    path: '/*/photo/:videoId',
    handler: handleVideo
  },
  {
    path: '/:author/live',
    handler: handleLive
  },
  {
    path: '/view/product/:shopId',
    handler: handleShop
  }
]

// temp-fix: add trailing slash to all routes
routes.forEach((route) => {
  app.get(route.path, route.handler)
  app.get(route.path + '/', route.handler)
})

export default app
