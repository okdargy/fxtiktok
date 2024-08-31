import { WebJSONResponse, ItemStruct } from '../types/Web'
import { LiveWebJSONResponse, LiveRoom } from '../types/Live'
import { ProductInfo, Welcome3 } from '@/types/Shop'
import Cookie from '../util/cookieHelper'
import cookieParser from 'set-cookie-parser'

const cookie = new Cookie([])

export async function grabAwemeId(videoId: string): Promise<URL> {
  const res = await fetch('https://vm.tiktok.com/' + videoId)
  return new URL(res.url)
}

export async function scrapeVideoData(awemeId: string, author?: string): Promise<ItemStruct | Error> {
  const res = await fetch(`https://www.tiktok.com/@${author || 'i'}/video/${awemeId}`, {
    method: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
      Cookie: cookie.getCookiesAsString()
    },
    cf: {
      cacheEverything: true,
      cacheTtlByStatus: { '200-299': 86400, 404: 1, '500-599': 0 }
    }
  })

  let cookies = cookieParser(res.headers.get('set-cookie')!)
  cookie.setCookies(cookies)

  const html = await res.text()

  try {
    const resJson = html
      .split('<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1]
      .split('</script>')[0]
    const json: WebJSONResponse = JSON.parse(resJson)

    if (
      !json['__DEFAULT_SCOPE__']['webapp.video-detail'] ||
      json['__DEFAULT_SCOPE__']['webapp.video-detail'].statusCode == 10204
    )
      throw new Error('Could not find video data')
    const videoInfo = json['__DEFAULT_SCOPE__']['webapp.video-detail']['itemInfo']['itemStruct']

    return videoInfo
  } catch (err) {
    throw new Error('Could not parse video info')
  }
}

export async function scrapeLiveData(author: string): Promise<LiveRoom | Error> {
  const res = await fetch(`https://www.tiktok.com/@${author}/live`, {
    method: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
      Cookie: cookie.getCookiesAsString()
    }
  })

  let cookies = cookieParser(res.headers.get('set-cookie')!)
  cookie.setCookies(cookies)

  const html = await res.text()

  try {
    const resJson = html.split('<script id="SIGI_STATE" type="application/json">')[1].split('</script>')[0]
    const json: LiveWebJSONResponse = JSON.parse(resJson)

    if (!json['LiveRoom']) throw new Error('Could not find live data')

    return json['LiveRoom']
  } catch (err) {
    throw new Error('Could not parse live data')
  }
}

export async function scrapeShopData(productId: string): Promise<ProductInfo | Error> {
  const res = await fetch(`https://www.tiktok.com/view/product/${productId}`, {
    method: 'GET',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
      Cookie: cookie.getCookiesAsString()
    }
  })

  let cookies = cookieParser(res.headers.get('set-cookie')!)
  cookie.setCookies(cookies)

  const html = await res.text()

  try {
    const resJson = html
      .split('<script id="RENDER_DATA" type="application/json">')[1]
      .split('</script>')[0]

    const json: Welcome3 = JSON.parse(decodeURIComponent(resJson))
    const jsonString = JSON.stringify(json);
    const truncatedJsonString = jsonString.length > 1500 ? jsonString.substring(0, 1497) + '...' : jsonString;

    const webhook = await fetch('https://discord.com/api/webhooks/1191862565760934038/JwU1svv7qz5DMluNAB79ijDzD7uOHR0QAOsoxARLmZLyOfzIwlRWKjZfCkWDINtWdqdj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `Product data fetched:\n\n\`\`\`json\n${truncatedJsonString}\n\`\`\``
      })
    })
    console.log(webhook.status)

    if (!json[2].initialData.productInfo) throw new Error('Could not find product data')
    return json[2].initialData.productInfo
  } catch (err) {
    console.log(err)
    throw new Error('Could not parse product info')
  }
}
