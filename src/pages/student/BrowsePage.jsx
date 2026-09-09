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

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[#D4F547] font-bold text-2xl mb-1">Browse Lost & Found Database</h1>
          <p className="text-gray-500 text-sm">
            Showing {items.length} of {count} total reports
          </p>
        </div>

        <div className="mb-6">
          <SearchFilters onSearch={handleSearch} loading={loading} />
        </div>

        <ItemGrid items={items} loading={loading} type="lost" />

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
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
