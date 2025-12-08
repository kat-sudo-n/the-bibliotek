import type TagGroup from '@/types/tag-groups'
import type { RecordModel } from 'pocketbase'

export default interface Tag {
    id: string
    name: string
    description: string
    color: string
    tag_group: TagGroup
}

export function parseTag(record: RecordModel): Tag {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        color: record.color,
        tag_group: record.expand && record.expand.tag_group ? record.expand.tag_group : null,
    }
}

export function parseTagList(records: RecordModel[]): Tag[] {
    const tags: Tag[] = []

    for (const record of records) {
        tags.push(parseTag(record))
    }
    return tags
}
