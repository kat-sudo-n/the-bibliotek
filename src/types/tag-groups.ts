import type { RecordModel } from 'pocketbase'

export default interface TagGroup {
    id: string
    name: string
    description: string
    color: string
}

export function parseTagGroup(record: RecordModel): TagGroup {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        color: record.color,
    }
}

export function parseTagList(records: RecordModel[]): TagGroup[] {
    const tags: TagGroup[] = []

    for (const record of records) {
        tags.push(parseTagGroup(record))
    }
    return tags
}
