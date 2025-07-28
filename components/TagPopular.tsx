'use client'

import React from 'react'

interface TagPopularProps {
  selectedTags: string[]
  onToggleTag: (tag: string) => void
}

const popularTags = [
  'pantai',
  'gunung',
  'bali',
  'kuliner',
  'lombok',
  'bandung',
  'puncak',
  'alam',
  'hiking',
  'budaya',
  'camping',
  'glamping',
]

const TagPopular = ({ selectedTags, onToggleTag }: TagPopularProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {popularTags.map(tag => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={`px-3 mt-2 py-1 rounded-full text-sm transition border ${
              isSelected
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}

export default TagPopular
