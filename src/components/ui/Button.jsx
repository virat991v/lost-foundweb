import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[#D4F547] text-black font-semibold hover:bg-[#c8ee38] disabled:opacity-50 btn-lime-glow btn-ripple',
  outline: 'border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#3a3a3a] disabled:opacity-50 btn-ripple',
  outlineLime: 'border border-[#D4F547] text-[#D4F547] hover:bg-[#D4F547]/10 disabled:opacity-50 btn-ripple',
  danger: 'border border-red-500 text-red-400 hover:bg-red-500/10 hover:border-red-400 disabled:opacity-50 btn-ripple',
  ghost: 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] disabled:opacity-50',
  dark: 'bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:bg-[#222222] hover:border-[#3a3a3a] disabled:opacity-50 btn-ripple',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        select-none cursor-pointer
        transition-all duration-200 ease-smooth
        active:scale-[0.97]
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />
      ) : icon ? (
        <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
      ) : null}
      {children}
    </button>
  )
})

export default Button
