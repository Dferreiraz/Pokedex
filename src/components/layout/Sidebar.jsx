function Sidebar({ currentPage, onPageChange, favoritesCount, teamCount }) {
  const menuItems = [
    { 
      id: 'home', 
      label: 'Início',
      badge: 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    { 
      id: 'favorites', 
      label: 'Favoritos', 
      badge: favoritesCount,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    },
    { 
      id: 'team', 
      label: 'Time', 
      badge: teamCount,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )
    },
    { 
      id: 'about', 
      label: 'Sobre',
      badge: 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        </svg>
      )
    },
  ]

  return (
    <aside className="hidden md:flex flex-col gap-3.5 bg-[#1d1d1a] border border-white/6 rounded-[20px] p-4 w-[80px] sticky top-4 h-fit ml-4 mt-4 items-center">
      {menuItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1.5 w-16 p-2.5 rounded-[14px] border-none bg-transparent relative transition-all duration-150 hover:bg-[#2a2a25] ${
              isActive ? '' : ''
            }`}
          >
            <span className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              isActive 
                ? 'bg-[#E3350D] text-[#F5F4EF]' 
                : 'text-[#9C9B92]'
            }`}>
              {item.icon}
            </span>
            <span className={`text-[11px] font-bold ${
              isActive ? 'text-[#F5F4EF]' : 'text-[#9C9B92]'
            }`}>
              {item.label}
            </span>
            {item.badge > 0 && (
              <span className="absolute top-0.5 right-1.5 bg-[#FFD93D] text-[#1B1B19] text-[10px] font-extrabold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  )
}

export default Sidebar