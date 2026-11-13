import { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, ArrowUpRight, UtensilsCrossed, Soup, Sandwich, Beef, CupSoda, X, Map } from 'lucide-react';
import { categories, photos } from '../data/demo';
import { normalize, money } from '../utils/helpers';
import { FoodCard, FoodImage, Empty } from '../components/UI';

const categoryIcons = [UtensilsCrossed, Soup, Sandwich, Beef, CupSoda];
const categoryLabels = ['Tudo', 'Regional', 'Tapiocas', 'Lanches', 'Bebidas'];

export default function Search({ businesses, open, contact, openMap }) {
 const [query, setQuery] = useState('');
 const [category, setCategory] = useState('Todos');
 const [max, setMax] = useState(50);
 const [showFilters, setShowFilters] = useState(false);
 const parsed = query.match(/at[eé]\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)/i);
 const keyword = normalize(query.replace(/at[eé]\s*(?:r\$\s*)?\d+(?:[.,]\d+)?/i, '').trim());
 const results = businesses.flatMap(business => business.menu.map(dish => ({ dish, business }))).filter(({ dish, business }) => normalize(`${dish.name} ${dish.description} ${business.name}`).includes(keyword) && (category === 'Todos' || dish.category === category) && dish.price <= Math.min(Number(max), parsed ? Number(parsed[1].replace(',', '.')) : Infinity));
 const filtered = query || category !== 'Todos' || max !== 50;

 return <div className="search-page">
  <button className="discover-map-link" onClick={openMap}><Map size={16}/><span>Descubra os sabores pelo mapa</span><ArrowUpRight size={15}/></button>
  <div className="discovery-heading"><p>Comida boa, pertinho de você.</p><h1>Qual é a sua fome hoje?</h1></div>
  <div className="search-row">
   <label className="search-box"><SearchIcon size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Encontre um prato ou um lugar" aria-label="Buscar pratos ou estabelecimentos"/>{query && <button onClick={() => setQuery('')} aria-label="Limpar busca"><X size={17}/></button>}</label>
   <button className={`filter-button ${showFilters ? 'selected' : ''}`} aria-label="Filtrar por preço" aria-expanded={showFilters} aria-controls="price-options" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={20}/></button>
  </div>
  {showFilters && <div className="filter-panel" id="price-options"><label htmlFor="max-price">Preço máximo <strong>{money(max)}</strong></label><input id="max-price" aria-label="Preço máximo" type="range" min="0" max="100" step="1" value={max} onChange={e => setMax(e.target.value)}/><p>Experimente também buscar “capote até R$ 30”.</p></div>}
  {!filtered && <section className="discovery-hero" aria-label="Descubra os sabores locais"><FoodImage src={photos.capote} alt="Arroz com capote, imagem ilustrativa"/><div className="hero-shade"/><div className="discovery-hero-copy"><span className="eyebrow">DA NOSSA TERRA</span><h2>Tempero de casa.<br/>Sabor do Piauí.</h2><p>Receitas que abraçam.<br/>Gente que faz com amor.</p><button onClick={() => document.getElementById('explorar')?.scrollIntoView({behavior:'smooth',block:'start'})}>Explorar sabores <span><ArrowUpRight size={16}/></span></button></div><span className="hero-caption">Imagem ilustrativa</span></section>}
  <section className="category-section" aria-label="Categorias de comida"><div className="section-heading"><h2>O que você procura?</h2><span>Escolha seu sabor</span></div><div className="categories">{categories.map((item, i) => { const Icon = categoryIcons[i]; return <button key={item} aria-label={item} aria-pressed={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}><span className="category-icon"><Icon size={24} strokeWidth={1.4}/></span><span className="category-label">{categoryLabels[i]}</span></button>; })}</div></section>
  <section id="explorar" className="explore"><div className="results-heading"><div><span className="eyebrow">FEITO POR QUEM É DAQUI</span><h2>{filtered ? 'Sabores encontrados' : 'Para matar a vontade'}</h2></div><span className="result-count">{results.length} {results.length === 1 ? 'opção' : 'opções'}</span></div>{filtered && <button className="clear-filters" onClick={() => { setQuery(''); setCategory('Todos'); setMax(50); }}>Limpar filtros <X size={13}/></button>}{results.length ? <div className="food-grid">{results.map(({ dish, business }) => <FoodCard key={dish.id} dish={dish} business={business} open={() => open(business.id)} contact={() => contact(business, dish)}/>)}</div> : <Empty text="Tente outro termo, categoria ou aumente o preço máximo."/>}</section>
 </div>;
}
