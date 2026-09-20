import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, helperText, icon, rightIcon, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300 transition-colors duration-200">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-[#D4F547]/70">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`
            input-field
            w-full bg-[#111111] border rounded-lg px-3 py-2.5 text-white text-sm
            placeholder-gray-600 outline-none
            ${error
              ? 'border-red-500 focus:border-red-400 error'
              : 'border-[#2a2a2a] focus:border-[#D4F547]'
            }
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 group-focus-within:text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

export default Input
