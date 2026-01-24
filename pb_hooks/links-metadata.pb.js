cronAdd('links-metadata-cron', '*/5 * * * *', async () => {
    const RECORD_LIMIT = 100

    const getMetadata = async (url) => {
        const res = await $http.send({
            method: 'GET',
            url: url,
            headers: { 'Content-Type': 'text/html' },
        })

        const html = res.raw

        function extractMeta(html, attr, value) {
            const regex = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"']+)["']`, 'i')
            return html.match(regex)?.[1] || null
        }

        function extractFavicon(html) {
            const match = html.match(/<link[^>]+rel=["']([^"']*icon[^"']*)["'][^>]+href=["']([^"']+)["']/i)
            const returnUrl = match && match.length > 2 ? match[2] : null
            if (returnUrl && typeof returnUrl === 'string') {
                return returnUrl
            } else {
                return null
            }
        }

        return {
            title: extractMeta(html, 'property', 'og:title') || null,

            description:
                extractMeta(html, 'property', 'og:description') || extractMeta(html, 'property', 'description') || null,

            image: extractMeta(html, 'property', 'og:image') || extractFavicon(html) || null,
        }
    }

    console.log('Executing cron task: links-metadata-cron')

    try {
        const result = await $app.findRecordsByFilter('links', 'og_image = ""', '', RECORD_LIMIT, 1)

        console.log('Processing ' + result.length + ' links without metadata.')

        for (const record of result) {
            const url = record.get('url')
            if (!url) return

            const ytMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)

            if (ytMatch) {
                const videoId = ytMatch[1]
                const imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

                record.set('og_title', '')
                record.set('og_image', imageUrl)

                $app.save(record)
            } else {
                const processedLink = await getMetadata(url)

                record.set('og_title', processedLink.title)
                record.set('og_description', processedLink.description)
                record.set('og_image', processedLink.image)
                $app.save(record)
            }
        }
    } catch (err) {
        console.error(err)
    }
    console.log('Finished cron task: links-metadata-cron')
})

function getDomain(url) {
    try {
        return new URL(url).origin
    } catch {
        return null
    }
}

function extractMeta(html, key) {
    const regex = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i')
    const match = html.match(regex)
    return match ? match[1] : null
}

function extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    return match ? match[1].trim() : null
}
