import Footer from '../components/layout/Footer'

function Favorites() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto">
      <div className="bg-[#1d1d1a] border border-white/6 rounded-[20px] p-8 md:p-12 text-center max-w-md w-full shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2a25] flex items-center justify-center text-4xl">
          ⭐
        </div>
        <h2 className="font-['Press_Start_2P'] text-[#FF6B4A] text-lg md:text-xl mb-4 leading-relaxed">
          EM DESENVOLVIMENTO
        </h2>
        <p className="text-[#9C9B92] text-sm md:text-base leading-relaxed mb-6">
          A página de Favoritos está sendo construída. Em breve você poderá salvar e gerenciar todos os seus Pokémon favoritos aqui!
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-[#2a2a25] border border-[#46453F] text-[#FFD93D] text-xs font-bold uppercase tracking-wider">
          Em breve
        </div>
      </div>
    </div>
  )
}

export default Favorites