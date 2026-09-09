export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
