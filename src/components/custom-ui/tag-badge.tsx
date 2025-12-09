import { Badge } from '@/components/ui/badge'
import type Tag from '@/types/tags'
import { CheckCircle } from 'lucide-react'

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
            className={`cursor-pointer select-none border-2 px-2 font-normal ${selected && 'font-semibold underline'}`}
            variant={selected ? 'secondary' : 'outline'}
            onClick={() => onTagClick()}
            style={{
                borderColor: tag.color ? tag.color : tag.tag_group?.color,
                color: tag.color ? tag.color : tag.tag_group?.color,
            }}
        >
            {selected && <CheckCircle className="w-4! h-4! text-white" />}
            {tag.name}
        </Badge>
    )
}
