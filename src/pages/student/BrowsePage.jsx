import { useState, useEffect, useCallback } from 'react'
import { lostItemsService } from '../../services/items/lostItemsService'
import { foundItemsService } from '../../services/items/foundItemsService'
import SearchFilters from '../../components/items/SearchFilters'
import ItemGrid from '../../components/items/ItemGrid'
import Pagination from '../../components/ui/Pagination'
import { PAGINATION_LIMIT } from '../../utils/constants'

export default function BrowsePage() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  // key bumped on every search/tab-switch to re-trigger grid entrance animation
  const [gridKey, setGridKey] = useState(0)

  const totalPages = Math.ceil(count / PAGINATION_LIMIT)

  const load = useCallback(async (f = filters, p = page) => {
    setLoading(true)
    try {
      const params = {
        page: p,
        category: f.category || undefined,
        location: f.location || undefined,
        search: f.query || undefined,
        status: f.status || undefined,
      }

      let data = [], total = 0
      if (!f.type || f.type === 'lost') {
        const res = await lostItemsService.getAll(params)
        data = [...data, ...(res.data ?? []).map((i) => ({ ...i, _type: 'lost' }))]
        total += res.count ?? 0
      }
      if (!f.type || f.type === 'found') {
        const res = await foundItemsService.getAll(params)
        data = [...data, ...(res.data ?? []).map((i) => ({ ...i, _type: 'found' }))]
        total += res.count ?? 0
      }

      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setItems(data)
      setCount(total)
      setGridKey((k) => k + 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { load() }, []) // eslint-disable-line

  function handleSearch(newFilters) {
    setFilters(newFilters)
    setPage(1)
    load(newFilters, 1)
  }

  function handlePageChange(p) {
    setPage(p)
    load(filters, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeType = filters.type || 'all'

  function handleTabChange(tab) {
    const newFilters = { ...filters, type: tab === 'all' ? undefined : tab }
    setFilters(newFilters)
    setPage(1)
    load(newFilters, 1)
  }

  const tabs = [
    { key: 'all',   label: 'All Items' },
    { key: 'lost',  label: '🔴 Lost' },
    { key: 'found', label: '🟢 Found' },
  ]

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="page-enter mb-6">
          <h1 className="text-[#D4F547] font-bold text-2xl mb-1">Browse Lost &amp; Found Database</h1>
          <p className="text-gray-500 text-sm">
            Showing {items.length} of {count} total reports
          </p>
        </div>

        {/* Lost / Found / All tabs */}
        <div className="page-enter-delay-1 flex gap-1 mb-6 bg-[#111111] border border-[#2a2a2a] rounded-xl p-1 w-fit">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeType === key
                  ? 'bg-[#D4F547] text-black shadow-[0_0_12px_rgba(212,245,71,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="page-enter-delay-2 mb-6">
          <SearchFilters onSearch={handleSearch} loading={loading} />
        </div>

        {/* Grid — re-keyed to replay entrance on every new result set */}
        <div key={gridKey} className={loading ? 'opacity-50 pointer-events-none transition-opacity duration-200' : 'transition-opacity duration-200'}>
          <ItemGrid items={items} loading={loading} />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 animate-fade-up">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
