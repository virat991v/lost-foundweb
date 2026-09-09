import { Bot, Sparkles } from 'lucide-react'

export default function AssistantPlaceholder() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#D4F547]/10 border border-[#D4F547]/20 flex items-center justify-center">
        <Bot size={24} className="text-[#D4F547]" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-white font-semibold">AI Matching Assistant</h3>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-[#D4F547]/10 text-[#D4F547] border border-[#D4F547]/20 px-2 py-0.5 rounded">
            Coming Soon
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
          IBM Watson-powered AI assistant will help match lost items to found reports using
          natural language processing and computer vision.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {[
          'Natural language item matching',
          'Image similarity detection',
          'Smart verification questions',
          'Fraud pattern detection',
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles size={14} className="text-[#D4F547]/50 flex-shrink-0" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}
