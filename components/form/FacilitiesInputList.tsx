'use client'

import { Facility } from '@/types/facility'
import React from 'react'

interface FacilitiesInputListProps {
  facilities: Facility[]
  onChange: (updated: Facility[]) => void
}

const FacilitiesInputList = ({ facilities, onChange }: FacilitiesInputListProps) => {
  const updateField = (index: number, key: keyof Facility, value: string) => {
    const updated = [...facilities]
    updated[index][key] = value
    onChange(updated)
  }

  const addFacility = () => {
    onChange([...facilities, { name: '', icon: '' }])
  }

  const removeFacility = (index: number) => {
    const updated = facilities.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">Fasilitas & Layanan</label>
      {facilities.map((facility, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Nama Fasilitas"
            value={facility.name}
            onChange={(e) => updateField(idx, 'name', e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Icon (opsional)"
            value={facility.icon}
            onChange={(e) => updateField(idx, 'icon', e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={() => removeFacility(idx)}
            className="text-red-600 font-bold"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addFacility}
        className="text-blue-600 mt-1"
      >
        + Tambah Fasilitas
      </button>
    </div>
  )
}

export default FacilitiesInputList
