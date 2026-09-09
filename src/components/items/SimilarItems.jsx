import ItemCard from './ItemCard'

export default function SimilarItems({ items = [], type = 'lost' }) {
  if (!items.length) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[#D4F547] rounded-full" />
        <h2 className="text-white font-semibold">Similar Items Detected</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  )
}
