import ItemCard from './ItemCard'
import { PageSpinner } from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import { Search } from 'lucide-react'

export default function ItemGrid({ items = [], loading = false, type = 'lost' }) {
  if (loading) return <PageSpinner />

  if (!items.length) {
    return (
      <EmptyState
        icon={<Search size={40} />}
        title="No items found"
        description="Try adjusting your search filters or check back later."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} type={item._type || type} />
      ))}
    </div>
  )
}
