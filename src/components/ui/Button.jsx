import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[#D4F547] text-black font-semibold hover:bg-[#c2e040] disabled:opacity-50',
  outline: 'border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] disabled:opacity-50',
  outlineLime: 'border border-[#D4F547] text-[#D4F547] hover:bg-[#D4F547]/10 disabled:opacity-50',
  danger: 'border border-red-500 text-red-400 hover:bg-red-500/10 disabled:opacity-50',
  ghost: 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] disabled:opacity-50',
  dark: 'bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:bg-[#222222] disabled:opacity-50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    icon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  )
})

export default Button
