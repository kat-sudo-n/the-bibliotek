import { columns } from '@/components/links-table/columns'
import { DataTable } from '@/components/links-table/data-table'
import type Link from '@/types/link'
import { parseLinkList } from '@/types/link'
import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react'

import CustomCheckbox from '@/components/custom-ui/checkbox'
import TagBadge from '@/components/custom-ui/tag-badge'
import TagFilter from '@/components/custom-ui/tag-filter'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarProvider,
} from '@/components/ui/sidebar'
import type TagGroup from '@/types/tag-groups'
import { parseTagGroupList } from '@/types/tag-groups'
import type Tag from '@/types/tags'
import { parseTagList } from '@/types/tags'
import { Search } from 'lucide-react'

const API_URL = import.meta.env.VITE_POCKETBASE_URL

export default function App() {
    // Data
    const [links, setLinks] = useState<Link[]>([])
    // Tags
    const [tags, setTags] = useState<Tag[]>([])
    // Tag Groups
    const [tagGroups, setTagGroups] = useState<TagGroup[]>([])
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

            // Tag groups
            const tagGroupsResult = await pb.collection('tag_groups').getList(1, 999, {})

            const tagGroups: TagGroup[] = parseTagGroupList(tagGroupsResult.items)
            tagGroups.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            setTagGroups(tagGroups)

            // Filters
        }

        getData()
    }, [currentPage, perPage, textFilter, nameFilter, descFilter, urlFilter, tagsFilter, forceTagsFilter])

    return (
        <>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader />
                    <SidebarContent>
                        <SidebarGroup>
                            <div className="flex flex-col gap-5">
                                <TagFilter
                                    tagGroups={tagGroups}
                                    tags={tags}
                                    selectedTags={tagsFilter}
                                    setSelectedTags={setTagsFilter}
                                />
                            </div>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter />
                </Sidebar>

                <main className="w-full px-20">
                    <div className="w-full px-5 flex flex-col gap-5 pt-10 justify-center mx-auto">
                        <h1 className="text-4xl font-extrabold tracking-tight text-balance">The Bibliotek</h1>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-5 max-w-xl">
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
                        </div>

                        {tagsFilter.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <h4>Filtrando etiquetas</h4>
                                <CustomCheckbox
                                    inputId="filter-tags-or"
                                    text="Filtrar que contenga todas las etiquetas seleccionadas."
                                    value={forceTagsFilter}
                                    onChange={setForceTagsFilter}
                                />
                                <div className="flex flex-row gap-2">
                                    {tags.map((tag) => {
                                        if (tagsFilter.includes(tag.id)) {
                                            return (
                                                <TagBadge
                                                    key={tag.id}
                                                    tag={tag}
                                                    selected={true}
                                                    onClick={() => {
                                                        setTagsFilter((prev) => {
                                                            return prev.filter((elem) => elem != tag.id)
                                                        })
                                                    }}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-5 rounded-lg overflow-hidden">
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
                </main>
            </SidebarProvider>
        </>
    )
}
