function Header({ onSearch }) {
  return (
    <header className="flex items-center gap-5 p-[22px] md:px-12 flex-wrap border-b border-white/6">
      <div className="w-[46px] h-[46px] rounded-full flex-none bg-gradient-to-br from-[#79B7EE] via-[#3E82C4] to-[#265D8F] border-[3px] border-[#F5F4EF] shadow-[0_0_0_3px_#1B1B19,0_0_18px_rgba(62,130,196,0.6)]"></div>
      
      <div className="flex-1 min-w-[220px]">
        <h1 className="font-['Press_Start_2P'] text-xl md:text-2xl mb-1.5 text-[#FF6B4A] leading-tight" style={{textShadow: '2px 2px 0 #701509'}}>Pokédex</h1>
        <p className="text-[#9C9B92] text-sm font-medium m-0">Explore todos os Pokémon da PokéAPI.</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault()
        const input = e.target.querySelector('input')
        if (input.value.trim()) {
          onSearch(input.value.trim())
          input.value = ''
        }
      }} className="flex gap-2 flex-1 min-w-[260px] max-w-[600px]">
        <input 
          type="text" 
          placeholder="Buscar por nome ou número (ex: pikachu, 25)" 
          className="flex-1 px-[18px] py-3.5 rounded-full border-2 border-[#46453F] bg-[#20201d] text-white text-sm placeholder-[#9C9B92] focus:outline-none focus:border-[#E3350D] transition-colors"
        />
        <button type="submit" className="px-6 py-3.5 rounded-full font-bold text-sm text-white transition-all bg-gradient-to-b from-[#FF6B4A] to-[#E3350D] shadow-[0_4px_0_#701509] active:translate-y-[3px] active:shadow-[0_1px_0_#701509] whitespace-nowrap">
          Pesquisar
        </button>
      </form>
    </header>
  )
}

export default Header