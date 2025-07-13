'use client'

import { ItineraryDay } from '@/types/itineraryDay'
import React from 'react'


interface ItineraryEditorProps {
  itinerary: ItineraryDay[]
  onChange: (updated: ItineraryDay[]) => void
}

const ItineraryEditor = ({ itinerary, onChange }: ItineraryEditorProps) => {
    const updateField = <K extends keyof ItineraryDay>(
    index: number,
    key: K,
    value: ItineraryDay[K]
    ) => {
    const updated = [...itinerary]
    updated[index][key] = value
    onChange(updated)
    }

  const updateActivity = (i: number, j: number, value: string) => {
    const updated = [...itinerary]
    updated[i].activities[j] = value
    onChange(updated)
  }

  const addActivity = (i: number) => {
    const updated = [...itinerary]
    updated[i].activities.push('')
    onChange(updated)
  }

  const removeActivity = (i: number, j: number) => {
    const updated = [...itinerary]
    updated[i].activities = updated[i].activities.filter((_, idx) => idx !== j)
    onChange(updated)
  }

  const removeDay = (i: number) => {
    const updated = itinerary.filter((_, idx) => idx !== i)
    onChange(updated)
  }

  const addDay = () => {
    const nextDay = itinerary.length + 1
    onChange([
      ...itinerary,
      { day: nextDay, title: '', meals: '', accommodation: '', activities: [''] },
    ])
  }

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">Itinerary</label>
      {itinerary.map((item, idx) => (
        <div key={idx} className="border rounded p-4 mb-4 space-y-2">
          <input
            type="number"
            placeholder="Hari ke-"
            value={item.day}
            onChange={(e) => updateField(idx, 'day', parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Judul Hari"
            value={item.title}
            onChange={(e) => updateField(idx, 'title', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Makanan"
            value={item.meals ?? ''}
            onChange={(e) => updateField(idx, 'meals', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Akomodasi"
            value={item.accommodation}
            onChange={(e) => updateField(idx, 'accommodation', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div>
            <label className="font-semibold">Aktivitas:</label>
            {item.activities.map((act, j) => (
              <div key={j} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={act}
                  onChange={(e) => updateActivity(idx, j, e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeActivity(idx, j)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addActivity(idx)}
              className="text-blue-600"
            >
              + Tambah Aktivitas
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeDay(idx)}
            className="text-red-600 mt-2 font-bold"
          >
            ✕ Hapus Hari Ini
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="text-blue-600 mt-2"
      >
        + Tambah Hari Baru
      </button>
    </div>
  )
}

export default ItineraryEditor
