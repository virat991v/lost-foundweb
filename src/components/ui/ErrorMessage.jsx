export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <span className="text-red-400 text-xl">!</span>
      </div>
      <h3 className="text-white font-medium mb-2">Something went wrong</h3>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[#D4F547] text-sm hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}
