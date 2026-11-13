import { useState } from 'react';
import { ArrowLeft, Clock3, MapPin, MessageCircle, Store } from 'lucide-react';
import { FoodCard, FoodImage, Empty } from '../components/UI';
import { photos } from '../data/demo';

export default function Storefront({ business, contact, notify, back, openMap }) {
 const [category, setCategory] = useState('Todos');
 const categories = ['Todos', ...new Set(business.menu.map(dish => dish.category))];
 const visible = business.menu.filter(dish => category === 'Todos' || dish.category === category);
 return <div className="store-page">
  <div className="store-cover"><FoodImage src={business.menu[0]?.image || photos.capote} alt="Capa ilustrativa do cardápio"/><button className="cover-back icon-button" aria-label="Voltar para os sabores" onClick={back}><ArrowLeft size={20}/></button><span className="cover-label"><Store size={13}/> Vitrine local</span><span className="photo-tag">Imagem ilustrativa</span></div>
  <section className="store-intro"><div className="store-identity"><span className="eyebrow">{business.category}</span><span className="status"><i/>{business.status}</span></div><h1>{business.name}<sup>*</sup></h1><p className="store-tagline">Comida de verdade. Feita com carinho.</p><div className="store-details"><span><Clock3 size={18}/><span><small>Funcionamento</small><strong>{business.hours}</strong></span></span><span><MapPin size={18}/><span><small>Teresina, PI</small><strong>{business.distance} de você*</strong></span></span></div><p className="demo-note">Horário, distância e disponibilidade de demonstração.</p><div className="store-actions"><button className="primary" onClick={() => contact(business)}><MessageCircle size={19}/> Pedir no WhatsApp</button><button className="secondary" aria-label="Como chegar" onClick={() => business.address?.trim() ? window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address + ', Teresina, PI')}`, '_blank', 'noopener,noreferrer') : notify('Como chegar: nenhum endereço foi cadastrado. Veja o ponto ilustrativo no mapa geral.')}><MapPin size={19}/><span>Como chegar</span></button></div></section>
  <button className="store-map-link" onClick={openMap}><MapPin size={16}/> Ver localização no mapa geral <span>↗</span></button>
  <section className="store-menu"><div className="section-heading"><h2>Feito para dar vontade</h2><span>{business.menu.length} {business.menu.length === 1 ? 'prato' : 'pratos'}</span></div><div className="menu-tabs" aria-label="Categorias do cardápio">{categories.map(item => <button key={item} className={category === item ? 'selected' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>{visible.length ? <div className="food-grid">{visible.map(dish => <FoodCard key={dish.id} dish={dish} contact={() => contact(business, dish)}/>)}</div> : <Empty text="O estabelecimento está preparando seu cardápio."/>}</section>
 </div>;
}
