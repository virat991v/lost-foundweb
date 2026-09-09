export default function ClaimStepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {steps.map((step, idx) => {
        const stepNum = idx + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isPending = stepNum > currentStep

        return (
          <div key={step} className="flex items-center gap-0 flex-shrink-0">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isCompleted
                    ? 'bg-[#D4F547] border-[#D4F547] text-black'
                    : isActive
                    ? 'bg-transparent border-[#D4F547] text-[#D4F547]'
                    : 'bg-transparent border-[#2a2a2a] text-gray-600'
                  }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[10px] font-medium text-center whitespace-nowrap max-w-[80px] leading-tight
                  ${isActive ? 'text-[#D4F547]' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {step}
              </span>
            </div>
            {/* Connector */}
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-10 sm:w-16 mx-1 mb-5 flex-shrink-0 ${
                  isCompleted ? 'bg-[#D4F547]' : 'bg-[#2a2a2a]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
