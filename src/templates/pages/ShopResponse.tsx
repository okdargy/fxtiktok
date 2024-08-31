import MetaHelper from '../../util/metaHelper'
import { ProductInfo } from '@/types/Shop';
import { formatNumber } from '../../util/format'

export function ShopResponse(data: ProductInfo): JSX.Element {
    let videoMeta: { name: string; content: string }[] = []
    const numberOfImages = data.product_base.images.length > 4 ? 4 : data.product_base.images.length

    for (let i = 0; i < numberOfImages; i++) {
        videoMeta = [
            ...videoMeta,
            {
                name: 'og:image',
                content: data.product_base.images[i].url_list[0]
            },
            {
                name: 'og:image:type',
                content: 'image/jpeg'
            },
            {
                name: 'og:image:width',
                content: 'auto'
            },
            {
                name: 'og:image:height',
                content: 'auto'
            },
            {
                name: 'og:type',
                content: 'image.other'
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image'
            }
        ]
    }

    let title = ''

    title += `🏷️ ${data.product_base.price.currency_symbol}${data.product_base.price.real_price} `
    title += `🛒 ${formatNumber(data.product_base.sold_count)} `
    title += `⭐ ${data.product_detail_review.product_rating} (${formatNumber(data.product_detail_review.review_count)}) `

    let desc = ''
    const desc_json = JSON.parse(data.product_base.desc_detail)

    desc = desc_json
        .map((item: { type: string; text: string }) => {
            return item.type === "text" && item.text.trim() !== "" ? item.text : ''
        })
        .filter((text: string) => text !== '')
        .join('\n')

    return (
        <>
            {MetaHelper(
                [
                    {
                        name: 'og:title',
                        content: title.trim()
                    },
                    {
                        name: 'theme-color',
                        content: '#ff0050' // TikTok's theme color
                    },
                    {
                        name: 'og:url',
                        content: `https://www.tiktok.com/view/product/${data.product_id}`
                    },
                    {
                        name: 'og:description',
                        content: desc
                    },
                    ...videoMeta
                ],
                {
                    title: data.seller.name,
                    redirect_url: `https://www.tiktok.com/view/product/${data.product_id}`
                }
            )}
        </>
    )
}
