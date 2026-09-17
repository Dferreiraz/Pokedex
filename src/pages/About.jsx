import Footer from '../components/layout/Footer'

function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto">
      <div className="bg-[#1d1d1a] border border-white/6 rounded-[20px] p-8 md:p-12 text-center max-w-2xl w-full shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2a25] flex items-center justify-center text-4xl">
          📖
        </div>
        <h2 className="font-['Press_Start_2P'] text-[#FF6B4A] text-lg md:text-xl mb-4 leading-relaxed">
          SOBRE O PROJETO
        </h2>
        <p className="text-[#9C9B92] text-sm md:text-base leading-relaxed mb-6">
          Este é um template visual de Pokédex, inspirado nos jogos clássicos e modernos da franquia Pokémon. 
          Os dados são carregados em tempo real da <span className="text-[#FF6B4A] font-bold">PokéAPI</span> para fins de estudo de React, consumo de APIs e estilização com Tailwind CSS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/Dferreiraz/Pokedex" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-bold text-sm text-white transition-all bg-gradient-to-b from-[#FF6B4A] to-[#E3350D] shadow-[0_4px_0_#701509] active:translate-y-[3px] active:shadow-[0_1px_0_#701509]"
          >
            Ver no GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

export default About