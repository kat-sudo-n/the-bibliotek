import { columns } from '@/components/links-table/columns'
import { DataTable } from '@/components/links-table/data-table'
import { Badge } from '@/components/ui/badge'
import type Link from '@/types/link'
import { parseLinkList } from '@/types/link'
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react'

import CustomCheckbox from '@/components/custom-ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import type Tag from '@/types/tags'
import { parseTagList } from '@/types/tags'
import { Search } from 'lucide-react'

const API_URL = import.meta.env.VITE_POCKETBASE_URL

export default function App() {
    // Data
    const [links, setLinks] = useState<Link[]>([])
    // Tags
    const [tags, setTags] = useState<Tag[]>([])
    // Filters
    const [textFilter, setTextFilter] = useState<string>('')
    const [nameFilter, setNameFilter] = useState<boolean>(true)
    const [descFilter, setDescFilter] = useState<boolean>(true)
    const [urlFilter, setUrlFilter] = useState<boolean>(true)
    const [forceTagsFilter, setForceTagsFilter] = useState<boolean>(false)
    const [tagsFilter, setTagsFilter] = useState<string[]>([])
    // Settings
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(25)

    useEffect(() => {
        const getData = async () => {
            const pocket_base_url = API_URL || 'http://127.0.0.1:8090'

            console.log('Connecting to Pocketbase at: ' + pocket_base_url)

            const pb = new PocketBase(pocket_base_url)

            const textFilterStrings: string[] = []
            const tagFilterStrings: string[] = []

            let filters = '('

            if (nameFilter) {
                textFilterStrings.push(`name ~ '${textFilter}'`)
            }
            if (descFilter) {
                textFilterStrings.push(`description ~ '${textFilter}'`)
            }
            if (urlFilter) {
                textFilterStrings.push(`url ~ '${textFilter}'`)
            }

            filters += textFilterStrings.join(' || ')

            filters += ')'

            if (tagsFilter.length > 0) {
                filters += '&& ( '
                for (const tagFilter of tagsFilter) {
                    tagFilterStrings.push(`tags ~ '${tagFilter}'`)
                }
                if (forceTagsFilter) {
                    filters += tagFilterStrings.join(' && ')
                } else {
                    filters += tagFilterStrings.join(' || ')
                }
                filters += ')'
            }

            // Links
            const linksResult = await pb.collection('links').getList(currentPage, perPage, {
                expand: 'tags',
                filter: filters,
                sort: 'created',
            })

            // Page Settings
            setCurrentPage(linksResult.page)
            setTotalPages(linksResult.totalPages)

            const links: Link[] = parseLinkList(linksResult.items)
            setLinks(links)

            // Tags
            const tagsResult = await pb.collection('tags').getList(1, 999, {})

            const tags: Tag[] = parseTagList(tagsResult.items)
            tags.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            setTags(tags)

            // Filters
        }

        getData()
    }, [currentPage, perPage, textFilter, nameFilter, descFilter, urlFilter, tagsFilter, forceTagsFilter])

    return (
        <>
            <div className="w-7xl flex flex-col gap-10 py-25 justify-center mx-auto">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    The Bibliotek
                </h1>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-row gap-5">
                        <InputGroup>
                            <InputGroupInput
                                value={textFilter}
                                onChange={(e) => setTextFilter(e.target.value)}
                                placeholder="Buscar..."
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <div className="flex flex-row gap-5 px-2">
                                    <CustomCheckbox
                                        inputId="filter-name"
                                        text="Nombre"
                                        value={nameFilter}
                                        onChange={setNameFilter}
                                    />
                                    <CustomCheckbox
                                        inputId="filter-description"
                                        text="Descripción"
                                        value={descFilter}
                                        onChange={setDescFilter}
                                    />
                                    <CustomCheckbox
                                        inputId="filter-url"
                                        text="Url"
                                        value={urlFilter}
                                        onChange={setUrlFilter}
                                    />
                                </div>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <CustomCheckbox
                        inputId="filter-tags-or"
                        text="Filtrar que contenga todas las etiquetas seleccionadas."
                        value={forceTagsFilter}
                        onChange={setForceTagsFilter}
                    />

                    <div className="flex flex-row flex-wrap gap-2">
                        {tags.map((tag) => {
                            const onTagClick = () => {
                                if (tagsFilter.includes(tag.id)) {
                                    setTagsFilter((prev) => {
                                        return prev.filter((elem) => elem != tag.id)
                                    })
                                } else {
                                    setTagsFilter((prev) => {
                                        if (prev.includes(tag.id)) return prev
                                        return [...prev, tag.id]
                                    })
                                }
                            }

                            return (
                                <Badge
                                    key={tag.id}
                                    className="cursor-pointer select-none"
                                    variant={tagsFilter.includes(tag.id) ? 'default' : 'outline'}
                                    onClick={onTagClick}
                                >
                                    {tag.name}
                                </Badge>
                            )
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <DataTable
                        columns={columns}
                        data={links}
                        perPage={perPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onPerPageChange={setPerPage}
                    />
                </div>
            </div>
        </>
    )
}
