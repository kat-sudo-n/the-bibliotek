import { columns } from '@/components/links-table/columns'
import { DataTable } from '@/components/links-table/data-table'
import type Link from '@/types/link'
import { parseLinkList } from '@/types/link'
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react'

import CustomCheckbox from '@/components/custom-ui/checkbox'
import TagBadge from '@/components/custom-ui/tag-badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import type Tag from '@/types/tags'
import { parseTagList } from '@/types/tags'
import { ChevronsUpDown, Search } from 'lucide-react'

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

    const [tagsOpen, setTagsOpen] = useState<boolean>(false)

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
                expand: 'tags,tags.tag_group',
                filter: filters,
                sort: 'created',
            })

            // Page Settings
            setCurrentPage(linksResult.page)
            setTotalPages(linksResult.totalPages)

            const links: Link[] = parseLinkList(linksResult.items)
            setLinks(links)

            // Tags
            const tagsResult = await pb.collection('tags').getList(1, 999, { expand: 'tag_group' })

            const tags: Tag[] = parseTagList(tagsResult.items)
            tags.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            setTags(tags)

            // Filters
        }

        getData()
    }, [currentPage, perPage, textFilter, nameFilter, descFilter, urlFilter, tagsFilter, forceTagsFilter])

    const onTagClick = (tagId: string) => {
        if (tagsFilter.includes(tagId)) {
            setTagsFilter((prev) => {
                return prev.filter((elem) => elem != tagId)
            })
        } else {
            setTagsFilter((prev) => {
                if (prev.includes(tagId)) return prev
                return [...prev, tagId]
            })
        }
    }

    return (
        <>
            <div className="w-full px-10 flex flex-col gap-10 pt-10 justify-center mx-auto">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    The Bibliotek
                </h1>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-5 max-w-4xl mx-auto">
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

                    <div className="flex flex-row flex-wrap gap-2 max-h-[10vh] overflow-auto">
                        {tags.map((tag) => {
                            if (tagsFilter.includes(tag.id)) {
                                return (
                                    <TagBadge tag={tag} selected={tagsFilter.includes(tag.id)} onClick={onTagClick} />
                                )
                            } else {
                                return ''
                            }
                        })}
                    </div>

                    <Collapsible open={tagsOpen} onOpenChange={setTagsOpen} className="w-full flex  flex-col gap-2">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline">
                                <ChevronsUpDown />
                                <span>Ver etiquetas</span>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-row flex-wrap gap-2">
                            {tags.map((tag) => {
                                return (
                                    <TagBadge tag={tag} selected={tagsFilter.includes(tag.id)} onClick={onTagClick} />
                                )
                            })}
                        </CollapsibleContent>
                    </Collapsible>
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
