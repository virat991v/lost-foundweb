export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="text-gray-600 mb-4">{icon}</div>
      )}
      <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>}
      {action && action}
    </div>
  )
}
