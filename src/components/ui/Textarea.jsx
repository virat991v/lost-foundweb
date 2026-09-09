import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full bg-[#111111] border rounded-lg px-3 py-2.5 text-white text-sm
          placeholder-gray-600 outline-none transition-colors resize-none
          ${error ? 'border-red-500 focus:border-red-400' : 'border-[#2a2a2a] focus:border-[#D4F547]'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Textarea
