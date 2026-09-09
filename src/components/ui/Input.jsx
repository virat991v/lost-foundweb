import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, helperText, icon, rightIcon, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[#111111] border rounded-lg px-3 py-2.5 text-white text-sm
            placeholder-gray-600 outline-none transition-colors
            ${error ? 'border-red-500 focus:border-red-400' : 'border-[#2a2a2a] focus:border-[#D4F547]'}
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Input
