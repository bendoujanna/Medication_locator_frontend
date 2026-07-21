export default function SuggestionChips({ chips, onSelect }) {
  return (
    <div className="relative">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {chips.map(chip => (
          <button key={chip} onClick={() => onSelect(chip)}
            className="flex-shrink-0 h-7 px-3 rounded-pill bg-rose-tint border border-rose-light text-rose text-[12px] font-medium font-sans whitespace-nowrap">
            {chip}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-cream to-transparent pointer-events-none"/>
    </div>
  )
}
