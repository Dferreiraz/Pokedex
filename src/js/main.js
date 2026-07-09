(function(){
  const API = 'https://pokeapi.co/api/v2/';
  let currentId = 1;
  const MAX_ID = 1010;
  const favorites = new Set();
  const team = [];
  const TEAM_MAX = 6;

  const el = (id) => document.getElementById(id);
  const pokeName = el('pokeName'), pokeNum = el('pokeNum'), pokeGen = el('pokeGen');
  const pokeImg = el('pokeImg'), imgPlaceholder = el('imgPlaceholder');
  const typeRow = el('typeRow');
  const statHeight = el('statHeight'), statWeight = el('statWeight'), statExp = el('statExp');
  const miniScreen = el('miniScreen');
  const loadingLeft = el('loadingLeft'), loadingRight = el('loadingRight');

  function typeClass(t){ return 't-' + t; }

  function setLoading(on){
    loadingLeft.classList.toggle('hidden', !on);
    loadingRight.classList.toggle('hidden', !on);
  }

  async function fetchJSON(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error('not found');
    return res.json();
  }

  function pickFlavorText(entries){
    let entry = entries.find(e => e.language.name === 'pt') || entries.find(e => e.language.name === 'en');
    if(!entry) return 'Descrição não disponível.';
    return entry.flavor_text.replace(/[\n\f\r]/g,' ');
  }

  async function loadPokemon(idOrName){
    setLoading(true);
    miniScreen.textContent = 'Buscando dados...';
    try{
      const pokemon = await fetchJSON(API + 'pokemon/' + idOrName);
      const species = await fetchJSON(API + 'pokemon-species/' + pokemon.id);
      currentId = pokemon.id;
      renderMain(pokemon, species);
      await Promise.all([
        renderStats(pokemon),
        renderEvolution(species),
        renderAbilities(pokemon),
        renderHabitat(pokemon, species)
      ]);
      renderInfo(pokemon, species);
      miniScreen.textContent = '#' + String(pokemon.id).padStart(4,'0') + ' ' + capitalize(pokemon.name) + ' — dados carregados';
      updateSidebarState();
    }catch(err){
      miniScreen.textContent = 'Erro: Pokémon não encontrado.';
      pokeName.textContent = 'não encontrado';
    }finally{
      setLoading(false);
    }
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function renderMain(pokemon, species){
    pokeName.textContent = pokemon.name;
    pokeNum.textContent = '№ ' + String(pokemon.id).padStart(3,'0');
    const gen = species.generation.name.split('-')[1] || '';
    pokeGen.textContent = 'GEN ' + gen.toUpperCase();

    const artwork = pokemon.sprites.other && pokemon.sprites.other['official-artwork']
      ? pokemon.sprites.other['official-artwork'].front_default
      : pokemon.sprites.front_default;
    if(artwork){
      pokeImg.src = artwork;
      pokeImg.alt = pokemon.name;
      pokeImg.classList.remove('hidden');
      imgPlaceholder.classList.add('hidden');
      pokeImg.style.animation = 'none';
      requestAnimationFrame(()=>{ pokeImg.style.animation = ''; });
    }

    typeRow.innerHTML = '';
    pokemon.types.forEach(t => {
      const span = document.createElement('span');
      span.className = 'type-badge ' + typeClass(t.type.name);
      span.textContent = t.type.name;
      typeRow.appendChild(span);
    });

    statHeight.textContent = (pokemon.height/10).toFixed(1) + ' m';
    statWeight.textContent = (pokemon.weight/10).toFixed(1) + ' kg';
    statExp.textContent = pokemon.base_experience ?? '—';
  }

  function renderInfo(pokemon, species){
    el('infoName').textContent = capitalize(pokemon.name);
    el('infoNum').textContent = '#' + String(pokemon.id).padStart(3,'0');
    const genus = species.genera.find(g => g.language.name === 'pt') || species.genera.find(g => g.language.name === 'en');
    el('infoCategory').textContent = genus ? genus.genus : '—';
    el('infoHW').textContent = (pokemon.height/10).toFixed(1) + ' m / ' + (pokemon.weight/10).toFixed(1) + ' kg';
    el('infoDesc').textContent = pickFlavorText(species.flavor_text_entries);
  }

  async function renderStats(pokemon){
    const container = el('statsContainer');
    container.innerHTML = '';
    const nameMap = {hp:'HP', attack:'Attack', defense:'Defense','special-attack':'Sp. Atk','special-defense':'Sp. Def',speed:'Speed'};
    pokemon.stats.forEach(s => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      const label = nameMap[s.stat.name] || s.stat.name;
      const pct = Math.min(100, Math.round((s.base_stat/255)*100));
      row.innerHTML = '<div class="stat-label">'+label+'</div>'+
        '<div class="stat-bar-track"><div class="stat-bar-fill" data-pct="'+pct+'"></div></div>'+
        '<div class="stat-value">'+s.base_stat+'</div>';
      container.appendChild(row);
    });
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        container.querySelectorAll('.stat-bar-fill').forEach(bar=>{
          bar.style.width = bar.dataset.pct + '%';
        });
      }, 60);
    });
  }

  async function renderEvolution(species){
    const evoRow = el('evoRow');
    evoRow.innerHTML = '<p class="desc-text">Carregando linha evolutiva...</p>';
    try{
      const chainData = await fetchJSON(species.evolution_chain.url);
      const nodes = [];
      function walk(node){
        const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
        nodes.push({ name: node.species.name, id: idMatch ? idMatch[1] : null });
        if(node.evolves_to && node.evolves_to.length){ walk(node.evolves_to[0]); }
      }
      walk(chainData.chain);
      evoRow.innerHTML = '';
      nodes.forEach((n, i) => {
        if(i > 0){
          const arrow = document.createElement('div');
          arrow.className = 'evo-arrow';
          arrow.textContent = '→';
          evoRow.appendChild(arrow);
        }
        const wrap = document.createElement('div');
        wrap.className = 'evo-node';
        const img = document.createElement('img');
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + n.id + '.png';
        img.alt = n.name;
        img.loading = 'lazy';
        const span = document.createElement('span');
        span.textContent = n.name;
        wrap.appendChild(img);
        wrap.appendChild(span);
        evoRow.appendChild(wrap);
      });
    }catch(e){
      evoRow.innerHTML = '<p class="desc-text">Sem dados de evolução disponíveis.</p>';
    }
  }

  async function renderAbilities(pokemon){
    const container = el('abilitiesContainer');
    container.innerHTML = '<p class="desc-text">Carregando habilidades...</p>';
    try{
      const abilities = pokemon.abilities.slice(0,3);
      const details = await Promise.all(abilities.map(a => fetchJSON(a.ability.url).catch(()=>null)));
      container.innerHTML = '';
      abilities.forEach((a, i) => {
        const d = details[i];
        const card = document.createElement('div');
        card.className = 'ability-card';
        let effect = 'Descrição não disponível.';
        if(d){
          const entry = d.effect_entries.find(e => e.language.name === 'en');
          if(entry) effect = entry.short_effect;
        }
        card.innerHTML = '<h4>'+a.ability.name.replace(/-/g,' ')+
          (a.is_hidden ? '<span class="ability-tag">Oculta</span>' : '') +'</h4>'+
          '<p>'+effect+'</p>';
        container.appendChild(card);
      });
    }catch(e){
      container.innerHTML = '<p class="desc-text">Sem dados de habilidades.</p>';
    }
  }

  async function renderHabitat(pokemon, species){
    el('habitatVal').textContent = species.habitat ? capitalize(species.habitat.name.replace(/-/g,' ')) : 'Desconhecido';
    el('genVal').textContent = capitalize(species.generation.name.replace('-',' '));
    el('captureVal').textContent = species.capture_rate + ' / 255';

    const weakList = el('weakList'), resistList = el('resistList');
    weakList.innerHTML = ''; resistList.innerHTML = '';
    try{
      const typeData = await Promise.all(pokemon.types.map(t => fetchJSON(t.type.url)));
      const weak = new Set(), resist = new Set();
      typeData.forEach(td => {
        td.damage_relations.double_damage_from.forEach(t => weak.add(t.name));
        td.damage_relations.half_damage_from.forEach(t => resist.add(t.name));
      });
      resist.forEach(t => weak.delete(t));
      const makeChip = (name) => {
        const c = document.createElement('span');
        c.className = 'chip ' + typeClass(name);
        c.textContent = name;
        return c;
      };
      if(weak.size === 0) weakList.innerHTML = '<p class="desc-text">Nenhuma fraqueza notável.</p>';
      else weak.forEach(t => weakList.appendChild(makeChip(t)));
      if(resist.size === 0) resistList.innerHTML = '<p class="desc-text">Nenhuma resistência notável.</p>';
      else resist.forEach(t => resistList.appendChild(makeChip(t)));
    }catch(e){
      weakList.innerHTML = '<p class="desc-text">Indisponível.</p>';
      resistList.innerHTML = '<p class="desc-text">Indisponível.</p>';
    }
  }

  /* -------- Tabs -------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      el('pane-' + btn.dataset.tab).classList.add('active');
    });
  });

  /* -------- Nav prev/next -------- */
  el('btnPrev').addEventListener('click', () => {
    const next = currentId > 1 ? currentId - 1 : MAX_ID;
    loadPokemon(next);
  });
  el('btnNext').addEventListener('click', () => {
    const next = currentId < MAX_ID ? currentId + 1 : 1;
    loadPokemon(next);
  });

  /* -------- Search -------- */
  el('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = el('searchInput').value.trim().toLowerCase();
    if(val) loadPokemon(val);
  });

  /* -------- Sidebar -------- */
  function setActiveNav(id){
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    el(id).classList.add('active');
  }
  function updateSidebarState(){
    const favBtn = el('navFav'), teamBtn = el('navTeam');
    favBtn.classList.toggle('active-fav', favorites.has(currentId));
  }
  el('navHome').addEventListener('click', () => { setActiveNav('navHome'); loadPokemon(1); });
  el('navFav').addEventListener('click', () => {
    setActiveNav('navFav');
    if(favorites.has(currentId)) favorites.delete(currentId); else favorites.add(currentId);
    const count = el('favCount');
    count.textContent = favorites.size;
    count.classList.toggle('hidden', favorites.size === 0);
  });
  el('navTeam').addEventListener('click', () => {
    setActiveNav('navTeam');
    if(!team.includes(currentId) && team.length < TEAM_MAX) team.push(currentId);
    const count = el('teamCount');
    count.textContent = team.length;
    count.classList.toggle('hidden', team.length === 0);
  });
  el('navAbout').addEventListener('click', () => { el('aboutModal').classList.remove('hidden'); });
  el('closeAbout').addEventListener('click', () => { el('aboutModal').classList.add('hidden'); });

  /* -------- Init -------- */
  loadPokemon(1);
})();
