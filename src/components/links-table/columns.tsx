import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type Link from '@/types/link'
import type Tag from '@/types/tags'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpRight, Clock, ClockArrowUp, Copy } from 'lucide-react'

export const columns: ColumnDef<Link>[] = [
    {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => {
            const name: string = row.getValue('name')
            const description: string = row.original.description
            return (
                <div className="flex flex-col">
                    <span className="font-bold">{name || ''}</span>
                    <span dangerouslySetInnerHTML={{ __html: description }}></span>
                </div>
            )
        },
    },
    {
        accessorKey: 'tags',
        header: 'Etiquetas',
        cell: ({ row }) => {
            const tags: Tag[] = row.getValue('tags')

            return (
                <div className="flex flex-wrap gap-1 items-center max-w-75">
                    {tags.map((tag) => (
                        <Badge key={tag.id}>{tag.name} </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: 'url',
        header: 'Enlace',
        cell: ({ row }) => {
            const url: string = row.getValue('url')

            const copyUrl = async () => {
                console.log('Copying')
                await navigator.clipboard.writeText(url)
            }

            return (
                <div className="flex flex-row gap-1 items-center">
                    <span className="mr-5 underline underline-offset-2 max-w-50 wrap-break-word overflow-clip">
                        {url}
                    </span>
                    <Button onClick={copyUrl}>
                        <Copy />
                    </Button>
                    <a href={url}>
                        <Button onClick={copyUrl}>
                            <ArrowUpRight />
                        </Button>
                    </a>
                </div>
            )
        },
    },
    {
        accessorKey: 'date',
        header: 'Fecha creación / edición',
        cell: ({ row }) => {
            const createdDate: Date = row.original.created
            const updatedDate: Date = row.original.updated

            return (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="font-light">
                        <Clock />
                        <span>{createdDate.toLocaleString()}</span>
                    </Badge>
                    <Badge variant="outline" className="font-light">
                        <ClockArrowUp />
                        <span>{updatedDate.toLocaleString()}</span>
                    </Badge>
                </div>
            )
        },
    },
]
