import TagBadge from '@/components/custom-ui/tag-badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
            const createdDate: string = row.original.created.toLocaleString()
            const updatedDate: string = row.original.updated.toLocaleString()

            return (
                <div className="flex flex-row min-w-75 gap-5">
                    <div className="h-full w-30 object-contain overflow-hidden rounded-xl">
                        <img src={row.original.og_image} className="" />
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex flex-row gap-2">
                            <span className="font-bold text-lg">{name || ''} </span>
                        </div>
                        <div className="flex flex-row gap-1">
                            <Popover>
                                <PopoverTrigger>
                                    <Clock size="1.25rem" />
                                </PopoverTrigger>
                                <PopoverContent>Creado: {createdDate.toLocaleString()}</PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger>
                                    <ClockArrowUp size="1.25rem" />
                                </PopoverTrigger>
                                <PopoverContent>Actualizado: {updatedDate.toLocaleString()}</PopoverContent>
                            </Popover>
                            <span className="text-wrap" dangerouslySetInnerHTML={{ __html: description }}></span>
                        </div>
                    </div>
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
                <div key={row.id} className="flex flex-wrap gap-1 items-center min-w-75">
                    {tags.map((tag) => (
                        <TagBadge key={tag.id} tag={tag} />
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
                await navigator.clipboard.writeText(url)
            }

            return (
                <div className="flex flex-row gap-3 items-center ">
                    <a href={url} className="max-w-50 underline underline-offset-2 wrap-break overflow-clip">
                        {url}
                    </a>
                    <Button variant="outline" size="sm" onClick={copyUrl}>
                        <Copy />
                    </Button>
                    <a href={url}>
                        <Button variant="outline" size="sm" onClick={copyUrl}>
                            <ArrowUpRight />
                        </Button>
                    </a>
                </div>
            )
        },
    },
]
