import { useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import PokedexShell from './components/pokedex/PokedexShell'
import Favorites from './pages/Favorites'
import Team from './pages/Team'
import About from './pages/About'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (term) => {
    setSearchQuery(term)
    if (currentPage !== 'home') {
      setCurrentPage('home')
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (page === 'home') {
      setSearchQuery('')
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'favorites': return <Favorites />
      case 'team': return <Team />
      case 'about': return <About />
      case 'home':
      default: return <PokedexShell searchQuery={searchQuery} />
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#2a2a26_0%,#141412_55%,#0c0c0b_100%)] text-[#F5F4EF] font-['Rubik'] flex flex-col">
      
      <Header onSearch={handleSearch} />

      <div className="flex flex-1 w-full">
        <Sidebar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
          favoritesCount={0}
          teamCount={0}
        />
        
        <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 min-h-[60vh]">
          <div className="w-full max-w-[1100px] flex justify-center">
            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default App