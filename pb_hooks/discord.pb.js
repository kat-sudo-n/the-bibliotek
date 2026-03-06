/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
    const DISCORD_WEBHOOK = $os.getenv('DISCORD_WEBHOOK_URL')

    if (!DISCORD_WEBHOOK) {
        console.error('Falta DISCORD_WEBHOOK_URL en las variables de entorno')
        e.next()
        return
    }

    const record = e.record
    const expandedTags = $app.findRecordsByIds('tags', record.getStringSlice('tags'))
    const tagNames = expandedTags.map((tag) => tag.getString('name')).join(', ')

    const payload = JSON.stringify({
        embeds: [
            {
                title: 'Nuevo registro creado en The Bibliotek',
                color: 0x5865f2,
                fields: [
                    { name: 'Nombre', value: record.getString('name') || 'N/A', inline: true },
                    { name: 'Url', value: record.getString('url') || 'N/A', inline: false },
                    { name: 'Tags', value: tagNames || 'Sin tags', inline: false },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    })

    $http.send({
        url: DISCORD_WEBHOOK,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
    })

    e.next()
}, 'links')
