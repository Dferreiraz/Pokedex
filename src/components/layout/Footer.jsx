function Footer() {
  return (
    <footer className="text-center py-8 px-4 text-[#9C9B92] text-xs border-t border-white/6 mt-8">
      <p>
        Projeto desenvolvido para estudos de React e Tailwind CSS utilizando a PokéAPI.
      </p>
      <p className="mt-2">
        Por{' '}
        <a 
          href="https://github.com/Dferreiraz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#FF6B4A] hover:text-[#FFD93D] transition-colors font-bold"
        >
          Davi Ferreira
        </a>
      </p>
    </footer>
  )
}

export default Footer