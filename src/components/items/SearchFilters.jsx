import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Select from '../ui/Select'
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../utils/constants'

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'lost', label: 'Lost Items' },
  { value: 'found', label: 'Found Items' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'matched', label: 'Matched' },
  { value: 'returned', label: 'Returned' },
]

const categoryOptions = [{ value: '', label: 'All Categories' }, ...CATEGORIES]
const locationOptions = [{ value: '', label: 'All Locations' }, ...CAMPUS_LOCATIONS]

export default function SearchFilters({ onSearch, loading = false }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch?.({ query, category, location, type, status })
  }

  function handleReset() {
    setQuery('')
    setCategory('')
    setLocation('')
    setType('')
    setStatus('')
    onSearch?.({})
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by item name, description..."
            className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:border-[#D4F547] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4F547] text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#c2e040] transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-36">
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
        </div>
        <div className="w-40">
          <Select
            options={locationOptions}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div className="w-32">
          <Select
            options={TYPE_OPTIONS}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        {(query || category || location || type || status) && (
          <button
            onClick={handleReset}
            className="text-gray-400 text-sm hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
