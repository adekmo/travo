'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, TagIcon, X } from 'lucide-react'
import TagPopular from './TagPopular'


const FilterStory = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [tagInput, setTagInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") || []
  )

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleApplyFilter = () => {
    const query = new URLSearchParams()
    if (search) query.set("search", search)
    if (selectedTags.length > 0) {
      query.set("tags", selectedTags.join(','))
    }
    router.push(`/stories?${query.toString()}`)
  }


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
      <div className="mb-5">
        <div className='flex items-center gap-2'>
            <Search className="h-5 w-5 text-gray-400" />
            <Input
            placeholder="Cari cerita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>
      <div className='mb-5'>
        <div className='flex items-center gap-2'>
            <TagIcon className="h-5 w-5 text-gray-400" />
            <Input
            placeholder="Tambah tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
        </div>
        <TagPopular selectedTags={selectedTags} onToggleTag={handleToggleTag} />
      </div>
      <div className="flex flex-wrap gap-2 my-5">
        {selectedTags.map((tag) => (
            <span key={tag} onClick={() => handleRemoveTag(tag)} className="flex gap-2 items-center bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm hover:cursor-pointer">
            #{tag}
            <X className='w-3 h-3'/>
            </span>
        ))}
      </div>
      <Button onClick={handleApplyFilter}>Terapkan</Button>
    </div>
  )
}

export default FilterStory
