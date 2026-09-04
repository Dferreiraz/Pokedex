import { useState } from 'react'
import './style.css'

const tabs = [
    { id: 'about', label: 'Sobre' },
    { id: 'stats', label: 'Stats' },
    { id: 'evolution', label: 'Evolução' },
    { id: 'abilities', label: 'Habilidades' }
]

function TabNavigation({ activeTab, onTabChange }) {
    return (
        <nav className="tab-navigation" role="tablist">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    )
}

export default TabNavigation
