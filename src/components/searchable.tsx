"use client"
import { JSX, ReactNode, useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch"

export interface SearchableProps {
    items: SearchableItem[]

}
export type SearchableFieldKey<T extends string> = T extends "content" ? never : T
export type SearchableItem = {
    content: JSX.Element,
    [key: SearchableFieldKey<string>]: string | JSX.Element
}
export default function Searchable({ items }: SearchableProps) {
    const [query, setQuery] = useState<string>("")
    const [results, setResults] = useState<ReactNode[]>(items.map(i => i.content))
    const miniSearch = useMemo(() => new MiniSearch<SearchableItem>({
        fields: Object.keys(items[0]),
        storeFields: ["content"]
    }), [items])
    miniSearch.addAll(items)
    useEffect(() => {
        if (query.length < 2) return setResults(items.map(i => i.content))
        setResults(miniSearch.search(query, {
            fuzzy: 0.9
        }).map(i => ((i as unknown) as SearchableItem).content))

    }, [items, miniSearch, query])
    return (
        <div>
            <input
                placeholder="Search"
                autoComplete="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="my-1 border-black border-3 p-1 accent-blue-800"
            />
            <div className="flex flex-row flex-wrap gap-2">
                {...results.map((r, i) => (
                    <>
                        {r}
                    </>
                ))}
            </div>
        </div>
    )
}