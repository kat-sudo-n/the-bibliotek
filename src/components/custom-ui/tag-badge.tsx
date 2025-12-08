import { Badge } from '@/components/ui/badge'
import type Tag from '@/types/tags'

export default function TagBadge({
    tag,
    selected = false,
    onClick = () => {},
}: {
    tag: Tag
    selected?: boolean
    onClick?: (tag_id: string) => void
}) {
    const onTagClick = () => {
        if (onClick) {
            onClick(tag.id)
        }
    }

    return (
        <Badge
            key={tag.id}
            className="cursor-pointer select-none"
            variant={selected ? 'default' : 'outline'}
            onClick={() => onTagClick()}
            style={{
                borderColor: tag.color ? tag.color : tag.tag_group?.color,
                color: tag.color ? tag.color : tag.tag_group?.color,
            }}
        >
            {tag.name}
        </Badge>
    )
}
