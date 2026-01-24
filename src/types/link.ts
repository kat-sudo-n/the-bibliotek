import type Tag from '@/types/tags'
import { parseTag } from '@/types/tags'
import type { RecordModel } from 'pocketbase'

export default interface Link {
    id: string
    name: string
    description: string
    url: string
    og_title: string
    og_description: string
    og_image: string
    created: Date
    updated: Date
    tags: Tag[]
}

export function parseLink(record: RecordModel): Link {
    const tags: Tag[] = []

    if (record.expand && record.expand.tags) {
        for (const tagRecord of record.expand.tags) {
            tags.push(parseTag(tagRecord))
        }
    }

    tags.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    return {
        id: record.id,
        name: record.name,
        description: record.description,
        url: record.url,
        og_title: record.og_title,
        og_description: record.og_description,
        og_image: record.og_image,
        created: new Date(record.created),
        updated: new Date(record.updated),
        tags: tags,
    }
}

export function parseLinkList(records: RecordModel[]): Link[] {
    const links: Link[] = []

    for (const record of records) {
        links.push(parseLink(record))
    }
    return links
}
