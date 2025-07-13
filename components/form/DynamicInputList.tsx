'use client'

import React from 'react'

interface DynamicInputListProps {
  label: string
  values: string[]
  onChange: (newValues: string[]) => void
  placeholder?: string
}

const DynamicInputList = ({
  label,
  values,
  onChange,
  placeholder,
}: DynamicInputListProps) => {
  const handleChange = (index: number, value: string) => {
    const updated = [...values]
    updated[index] = value
    onChange(updated)
  }

  const handleRemove = (index: number) => {
    const updated = values.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleAdd = () => {
    onChange([...values, ''])
  }

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">{label}</label>
      {values.map((val, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder={placeholder || 'Isi item'}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="text-red-600 font-bold"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-blue-600 mt-1"
      >
        + Tambah
      </button>
    </div>
  )
}

export default DynamicInputList
