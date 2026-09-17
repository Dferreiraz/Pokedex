import { useState, useEffect, useCallback } from 'react';

const API = 'https://pokeapi.co/api/v2/';

const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function PokedexShell({ searchQuery }) {
  const [currentId, setCurrentId] = useState(1);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [hasSearched, setHasSearched] = useState(false);
  
  const [evoData, setEvoData] = useState([]);
  const [abilitiesData, setAbilitiesData] = useState([]);
  const [habitatData, setHabitatData] = useState({});

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('not found');
    return res.json();
  }

  const pickFlavorText = (entries) => {
    let entry = entries.find(e => e.language.name === 'pt') || entries.find(e => e.language.name === 'en');
    if (!entry) return 'Descrição não disponível.';
    return entry.flavor_text.replace(/[\n\f\r]/g, ' ');
  }

  const loadPokemon = useCallback(async (idOrName) => {
    if (!idOrName) return;
    
    setLoading(true);
    setError(null);
    try {
      const pokeData = await fetchJSON(API + 'pokemon/' + idOrName);
      const speciesData = await fetchJSON(API + 'pokemon-species/' + pokeData.id);
      
      setCurrentId(pokeData.id);
      setPokemon(pokeData);
      setSpecies(speciesData);

      await Promise.all([
        loadEvolution(speciesData),
        loadAbilities(pokeData),
        loadHabitat(pokeData, speciesData)
      ]);
    } catch (err) {
      setError('Pokémon não encontrado.');
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      setHasSearched(true);
      loadPokemon(searchQuery.trim());
    } else if (!hasSearched && !pokemon) {
      loadPokemon(1);
      setHasSearched(true);
    }
  }, [searchQuery, loadPokemon])

  const loadEvolution = async (speciesData) => {
    try {
      const chainData = await fetchJSON(speciesData.evolution_chain.url);
      const nodes = [];
      const walk = (node) => {
        const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
        nodes.push({ name: node.species.name, id: idMatch ? idMatch[1] : null });
        if (node.evolves_to && node.evolves_to.length) walk(node.evolves_to[0]);
      };
      walk(chainData.chain);
      setEvoData(nodes);
    } catch (e) { setEvoData([]); }
  }

  const loadAbilities = async (pokeData) => {
    try {
      const abilities = pokeData.abilities.slice(0, 3);
      const details = await Promise.all(abilities.map(a => fetchJSON(a.ability.url).catch(() => null)));
      const mapped = abilities.map((a, i) => {
        const d = details[i];
        let effect = 'Descrição não disponível.';
        if (d) {
          const entry = d.effect_entries.find(e => e.language.name === 'en');
          if (entry) effect = entry.short_effect;
        }
        return { name: a.ability.name.replace(/-/g, ' '), isHidden: a.is_hidden, effect };
      });
      setAbilitiesData(mapped);
    } catch (e) { setAbilitiesData([]) }
  }

  const loadHabitat = async (pokeData, speciesData) => {
    try {
      const typeData = await Promise.all(pokeData.types.map(t => fetchJSON(t.type.url)));
      const weak = new Set(), resist = new Set();
      typeData.forEach(td => {
        td.damage_relations.double_damage_from.forEach(t => weak.add(t.name));
        td.damage_relations.half_damage_from.forEach(t => resist.add(t.name));
      });
      resist.forEach(t => weak.delete(t))
      
      setHabitatData({
        habitat: speciesData.habitat ? capitalize(speciesData.habitat.name.replace(/-/g, ' ')) : 'Desconhecido',
        generation: capitalize(speciesData.generation.name.replace('-', ' ')),
        captureRate: speciesData.capture_rate + ' / 255',
        weak: Array.from(weak),
        resist: Array.from(resist)
      });
    } catch (e) { setHabitatData({ weak: [], resist: [] }) }
  }

  const handlePrev = () => {
    setHasSearched(true);
    loadPokemon(currentId > 1 ? currentId - 1 : 1010)
  }
  
  const handleNext = () => {
    setHasSearched(true);
    loadPokemon(currentId < 1010 ? currentId + 1 : 1)
  }

  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <div className="bg-[#E9F1E6] border-[10px] border-[#1B1B19] rounded-[16px] p-8 min-w-[300px] text-center font-['VT323'] text-2xl text-[#182b1c] animate-pulse">
          Carregando dados...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center w-full">
        <div className="bg-[#E9F1E6] border-[10px] border-[#1B1B19] rounded-[16px] p-8 min-w-[300px] text-center font-['VT323'] text-2xl text-[#E3350D]">
          {error}
        </div>
      </div>
    )
  }

  if (!pokemon || !species) return null;

  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  const genus = species.genera.find(g => g.language.name === 'pt') || species.genera.find(g => g.language.name === 'en')
  const flavorText = pickFlavorText(species.flavor_text_entries);
  const gen = species.generation.name.split('-')[1] || ''

  return (
    <div className="flex justify-center w-full">
      <div className="flex w-full max-w-[980px] filter drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]">
        
        {/* ===== PANEL LEFT ===== */}
        <div className="relative flex-[1.05] min-w-0 z-[2] rounded-l-[26px] rounded-r-[8px] p-[18px]"
          style={{ background: 'linear-gradient(160deg, #FF6B4A 0%, #E3350D 18%, #A81F0E 78%, #701509 100%)' }}>
          
          <div className="flex items-center gap-[10px] mb-[14px] pl-1">
            <div className="w-[52px] h-[52px] rounded-full flex-none relative animate-[lensGlow_3.2s_ease-in-out_infinite]"
              style={{ background: 'radial-gradient(circle at 32% 28%, #cdeeff 0%, #79B7EE 30%, #3E82C4 60%, #265D8F 100%)', border: '4px solid #F5F4EF', boxShadow: '0 0 0 3px #1B1B19, inset 0 0 10px rgba(255,255,255,0.6)' }}>
              <div className="absolute top-[15%] left-[20%] w-[30%] h-[22%] bg-white/85 rounded-full blur-[1px]"></div>
            </div>
            <div className="flex gap-2 ml-0.5">
              <div className="w-[10px] h-[10px] rounded-full border-2 border-black/35" style={{ background: '#FF6B4A', boxShadow: '0 0 6px 1px #FF6B4A' }}></div>
              <div className="w-[10px] h-[10px] rounded-full border-2 border-black/35 animate-[blink_2.6s_infinite]" style={{ background: '#FFD93D', boxShadow: '0 0 6px 1px #FFD93D' }}></div>
              <div className="w-[10px] h-[10px] rounded-full border-2 border-black/35" style={{ background: '#3FAE55', boxShadow: '0 0 6px 1px #3FAE55' }}></div>
            </div>
          </div>

          <div className="relative rounded-[16px] p-[14px]" style={{ background: '#E9F1E6', border: '10px solid #1B1B19', boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.08)', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 3px)' }}>
            <div className="flex justify-between items-baseline mb-[2px] font-['VT323'] text-[#182b1c] text-[22px]">
              <span>№ {String(pokemon.id).padStart(3, '0')}</span>
              <span>GEN {gen.toUpperCase()}</span>
            </div>

            <h2 className="font-bold text-[clamp(20px,2.4vw,26px)] text-[#1B1B19] capitalize m-0 mb-2">{pokemon.name}</h2>

            <div className="relative overflow-hidden rounded-[8px] mb-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #ffffff, #E9F1E6)', border: '2px solid #c3d6bd', height: 'min(38vw, 240px)' }}>
              <img src={artwork} alt={pokemon.name} className="max-w-[80%] max-h-[85%] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.25)]" style={{ animation: 'fadeIn 0.5s ease forwards' }} />
            </div>

            <div className="flex gap-2 flex-wrap mb-[10px]">
              {pokemon.types.map(t => (
                <span key={t.type.name} className="font-bold text-[12px] tracking-[0.4px] text-white px-[14px] py-[5px] rounded-full uppercase shadow-[inset_0_-2px_0_rgba(0,0,0,0.2),0_2px_3px_rgba(0,0,0,0.25)]" style={{ background: typeColors[t.type.name] || '#A8A77A' }}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-white/55 border border-[#c3d6bd] rounded-[10px] p-2 text-center">
                <span className="block text-[10px] text-[#46453F] uppercase tracking-[0.5px] font-bold">Altura</span>
                <strong className="font-['VT323'] text-[20px] text-[#182b1c]">{(pokemon.height / 10).toFixed(1)} m</strong>
              </div>
              <div className="bg-white/55 border border-[#c3d6bd] rounded-[10px] p-2 text-center">
                <span className="block text-[10px] text-[#46453F] uppercase tracking-[0.5px] font-bold">Peso</span>
                <strong className="font-['VT323'] text-[20px] text-[#182b1c]">{(pokemon.weight / 10).toFixed(1)} kg</strong>
              </div>
              <div className="bg-white/55 border border-[#c3d6bd] rounded-[10px] p-2 text-center">
                <span className="block text-[10px] text-[#46453F] uppercase tracking-[0.5px] font-bold">Exp. Base</span>
                <strong className="font-['VT323'] text-[20px] text-[#182b1c]">{pokemon.base_experience ?? '—'}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-[5px] my-3 mx-1">
              <div className="h-[3px] rounded-[2px] bg-black/25 w-[70%]"></div>
              <div className="h-[3px] rounded-[2px] bg-black/25 w-full"></div>
              <div className="h-[3px] rounded-[2px] bg-black/25 w-[55%]"></div>
            </div>

            <div className="flex items-center justify-between gap-[10px]">
              <button onClick={handlePrev} className="flex-1 flex items-center justify-center gap-[6px] py-3 px-2 rounded-[14px] border-none font-bold text-[13px] text-white shadow-[0_3px_0_#000,inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[2px] active:shadow-[0_1px_0_#000] transition-transform" style={{ background: 'linear-gradient(180deg, #2b2b28, #1B1B19)' }}>
                ◀ Anterior
              </button>
              <div className="w-[46px] h-[46px] flex-none relative">
                <div className="absolute w-full h-[34%] top-[33%] left-0 bg-[#1B1B19] rounded-[4px]"></div>
                <div className="absolute w-[34%] h-full left-[33%] top-0 bg-[#1B1B19] rounded-[4px]"></div>
              </div>
              <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-[6px] py-3 px-2 rounded-[14px] border-none font-bold text-[13px] text-white shadow-[0_3px_0_#000,inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-[2px] active:shadow-[0_1px_0_#000] transition-transform" style={{ background: 'linear-gradient(180deg, #2b2b28, #1B1B19)' }}>
                Próximo ▶
              </button>
            </div>
          </div>
        </div>

        {/* ===== HINGE ===== */}
        <div className="w-[26px] self-stretch relative z-[3] flex-none" style={{ background: 'linear-gradient(90deg, #701509, #A81F0E 50%, #701509)' }}>
          <div className="absolute left-1/2 -translate-x-1/2 top-[22px] w-[14px] h-[14px] rounded-full border-2 border-[#0a0a0a]" style={{ background: 'radial-gradient(circle at 35% 30%, #555 0%, #1a1a1a 70%)' }}></div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[22px] w-[14px] h-[14px] rounded-full border-2 border-[#0a0a0a]" style={{ background: 'radial-gradient(circle at 35% 30%, #555 0%, #1a1a1a 70%)' }}></div>
        </div>

        {/* ===== PANEL RIGHT ===== */}
        <div className="relative flex-1 min-w-0 z-[1] rounded-l-[8px] rounded-r-[26px] p-[18px] -translate-x-2 border-l-2 border-black/25" style={{ background: 'linear-gradient(160deg, #FF6B4A 0%, #E3350D 18%, #A81F0E 78%, #701509 100%)' }}>
          
          <div className="rounded-[10px] p-2 px-3 mb-[14px] font-['VT323'] text-[#8fdc9e] text-[17px] tracking-[0.5px] min-h-[42px] flex items-center overflow-hidden whitespace-nowrap" style={{ background: '#182b1c', border: '6px solid #1B1B19' }}>
            #{String(pokemon.id).padStart(4, '0')} {capitalize(pokemon.name)} — dados carregados
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'info', label: 'Informações', icon: '📋' },
              { id: 'stats', label: 'Estatísticas', icon: '⚔️' },
              { id: 'evo', label: 'Evoluções', icon: '🧬' },
              { id: 'abilities', label: 'Habilidades', icon: '🎒' },
              { id: 'habitat', label: 'Habitat', icon: '🌎' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-none rounded-[12px] py-3 px-[6px] font-bold text-[12px] flex flex-col items-center gap-1 shadow-[0_3px_0_#163f5e,inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform active:translate-y-[2px] ${
                  activeTab === tab.id
                    ? 'bg-[#FFD93D] text-[#1B1B19] shadow-[0_3px_0_#b39a1f,inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'bg-[#265D8F] text-white hover:bg-[#3E82C4]'
                }`}
              >
                <span className="text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="rounded-[16px] p-4 min-h-[300px] text-[#1B1B19] shadow-[inset_0_0_0_3px_rgba(0,0,0,0.1)]" style={{ background: '#F5F4EF', border: '10px solid #1B1B19' }}>
            
            {activeTab === 'info' && (
              <div>
                <h3 className="font-['Press_Start_2P'] text-[13px] text-[#A81F0E] m-0 mb-3 tracking-[0.5px]">INFORMAÇÕES</h3>
                <div className="grid grid-cols-2 gap-[10px] text-[14px]">
                  <div><dt className="text-[11px] uppercase text-[#46453F] font-bold tracking-[0.4px] mb-[2px]">Nome</dt><dd className="m-0 font-semibold capitalize">{pokemon.name}</dd></div>
                  <div><dt className="text-[11px] uppercase text-[#46453F] font-bold tracking-[0.4px] mb-[2px]">Número</dt><dd className="m-0 font-semibold">#{String(pokemon.id).padStart(3, '0')}</dd></div>
                  <div><dt className="text-[11px] uppercase text-[#46453F] font-bold tracking-[0.4px] mb-[2px]">Categoria</dt><dd className="m-0 font-semibold capitalize">{genus ? genus.genus : '—'}</dd></div>
                  <div><dt className="text-[11px] uppercase text-[#46453F] font-bold tracking-[0.4px] mb-[2px]">Altura / Peso</dt><dd className="m-0 font-semibold">{(pokemon.height / 10).toFixed(1)} m / {(pokemon.weight / 10).toFixed(1)} kg</dd></div>
                  <div className="col-span-2"><dt className="text-[11px] uppercase text-[#46453F] font-bold tracking-[0.4px] mb-[2px]">Descrição</dt><dd className="m-0 text-[14px] leading-[1.6] text-[#46453F]">{flavorText}</dd></div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h3 className="font-['Press_Start_2P'] text-[13px] text-[#A81F0E] m-0 mb-3 tracking-[0.5px]">ESTATÍSTICAS</h3>
                <div className="space-y-3">
                  {pokemon.stats.map(s => {
                    const nameMap = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed' };
                    const label = nameMap[s.stat.name] || s.stat.name;
                    const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
                    return (
                      <div key={s.stat.name} className="flex items-center gap-[10px]">
                        <span className="w-[120px] text-[12px] font-bold uppercase text-[#46453F] flex-none">{label}</span>
                        <div className="flex-1 h-[14px] bg-[#D9D8CF] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#237339] to-[#3FAE55]" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="w-[34px] text-right font-['VT323'] text-[18px] flex-none">{s.base_stat}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'evo' && (
              <div>
                <h3 className="font-['Press_Start_2P'] text-[13px] text-[#A81F0E] m-0 mb-3 tracking-[0.5px]">LINHA EVOLUTIVA</h3>
                {evoData.length > 0 ? (
                  <div className="flex items-center justify-center gap-[10px] flex-wrap">
                    {evoData.map((n, i) => (
                      <div key={n.id} className="flex flex-col items-center gap-1">
                        {i > 0 && <span className="text-[20px] text-[#E3350D] font-extrabold">→</span>}
                        <div className="flex flex-col items-center gap-1 w-[90px]">
                          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n.id}.png`} alt={n.name} className="w-16 h-16 object-contain bg-[#E9F1E6] rounded-xl border border-[#c3d6bd]" loading="lazy" />
                          <span className="text-[12px] font-bold capitalize">{n.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-[#46453F]">Sem dados de evolução disponíveis.</p>
                )}
              </div>
            )}

            {activeTab === 'abilities' && (
              <div>
                <h3 className="font-['Press_Start_2P'] text-[13px] text-[#A81F0E] m-0 mb-3 tracking-[0.5px]">HABILIDADES</h3>
                <div className="space-y-2">
                  {abilitiesData.map((a, i) => (
                    <div key={i} className="bg-[#E9F1E6] border border-[#c3d6bd] rounded-xl p-3">
                      <h4 className="m-0 text-[14px] capitalize text-[#A81F0E] flex items-center gap-2">
                        {a.name}
                        {a.isHidden && <span className="text-[10px] bg-[#265D8F] text-white px-2 py-0.5 rounded-full uppercase font-bold">Oculta</span>}
                      </h4>
                      <p className="m-0 text-[13px] text-[#46453F] leading-[1.5] mt-1">{a.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'habitat' && (
              <div>
                <h3 className="font-['Press_Start_2P'] text-[13px] text-[#A81F0E] m-0 mb-3 tracking-[0.5px]">HABITAT & DETALHES</h3>
                <div className="grid grid-cols-2 gap-3 text-[13px] mb-4">
                  <div><h4 className="m-0 mb-1 text-[11px] uppercase tracking-[0.4px] text-[#46453F] font-bold">Habitat</h4><p className="m-0 font-semibold capitalize">{habitatData.habitat || '—'}</p></div>
                  <div><h4 className="m-0 mb-1 text-[11px] uppercase tracking-[0.4px] text-[#46453F] font-bold">Geração</h4><p className="m-0 font-semibold capitalize">{habitatData.generation || '—'}</p></div>
                  <div><h4 className="m-0 mb-1 text-[11px] uppercase tracking-[0.4px] text-[#46453F] font-bold">Taxa de Captura</h4><p className="m-0 font-semibold">{habitatData.captureRate || '—'}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="m-0 mb-2 text-[11px] uppercase tracking-[0.4px] text-[#46453F] font-bold">Fraquezas</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {habitatData.weak?.length > 0 ? habitatData.weak.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[12px] font-bold text-white capitalize" style={{ background: typeColors[t] || '#A8A77A' }}>{t}</span>
                      )) : <p className="text-[12px] text-[#46453F]">Nenhuma fraqueza notável.</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="m-0 mb-2 text-[11px] uppercase tracking-[0.4px] text-[#46453F] font-bold">Resistências</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {habitatData.resist?.length > 0 ? habitatData.resist.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[12px] font-bold text-white capitalize" style={{ background: typeColors[t] || '#A8A77A' }}>{t}</span>
                      )) : <p className="text-[12px] text-[#46453F]">Nenhuma resistência notável.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-[14px] items-center">
            <div className="flex-1 h-[26px] rounded-[6px] border-none shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)] bg-[#F5F4EF]"></div>
            <div className="flex-1 h-[26px] rounded-[6px] border-none shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)] bg-[#F5F4EF]"></div>
            <div className="flex-1 h-[26px] rounded-[6px] border-none shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)] bg-[#237339]"></div>
            <div className="flex-1 h-[26px] rounded-[6px] border-none shadow-[inset_0_-2px_0_rgba(0,0,0,0.25)] bg-[#237339]"></div>
            <div className="w-[16px] h-[16px] rounded-full bg-[#FFD93D] shadow-[0_0_6px_2px_#FFD93D] flex-none"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokedexShell