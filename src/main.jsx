import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Store, ClipboardList, UserRound, MapPin, Map, X, Sprout } from 'lucide-react';
import { defaultBusiness, defaultMenu, otherBusinesses, resolveDishImage } from './data/demo';
import { phoneDigits, useStored } from './utils/helpers';
import SearchPage from './pages/Search';
import Storefront from './pages/Storefront';
import Menu from './pages/Menu';
import Register from './pages/Register';
import Auth, { ChooseRole } from './pages/Auth';
import Profile from './pages/Profile';
import MapPage from './pages/Map';
import './styles.css';
import './flows.css';

const allTabs = [
 { id: 'busca', label: 'Busca', icon: Search },
 { id: 'mapa', label: 'Mapa', icon: Map },
 { id: 'cardapio', label: 'Cardápio', icon: ClipboardList },
 { id: 'vitrine', label: 'Vitrine', icon: Store },
 { id: 'perfil', label: 'Perfil', icon: UserRound },
];
const validPages = [...allTabs.map(tab=>tab.id),'cadastro'];
const pageFromHash = () => validPages.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'busca';

function App() {
 const [requestedPage, setPage] = useState(pageFromHash);
 const [accounts,saveAccounts,accountsError]=useStored('ohfome.accounts.v1',[]);
 const [session,saveSession,sessionError]=useStored('ohfome.session.v1',null);
 const account=accounts.find(item=>item.id===session?.accountId);
 const [business, saveBusiness, businessError] = useStored('ohfome.business.v1', defaultBusiness);
 const [storedMenu, saveMenu, menuError] = useStored('ohfome.menu.v1', defaultMenu);
 const menu = storedMenu.map(dish => ({ ...dish, image: resolveDishImage(dish) }));
 const [selected, setSelected] = useState('raimundo');
 const [mapFocus,setMapFocus]=useState(null);
 const [notice, setNotice] = useState('');
 const businesses = [{ ...business, menu }, ...otherBusinesses];
 const activeBusiness = businesses.find(b => b.id === selected) || businesses[0];
 const isSeller=account?.role==='vendedor';
 const page=!isSeller&&['cadastro','cardapio'].includes(requestedPage)?'busca':requestedPage;
 const tabs=allTabs.filter(tab=>isSeller||!['cardapio','vitrine'].includes(tab.id));

 useEffect(() => {
  const handler = () => { setPage(pageFromHash()); window.scrollTo({ top: 0 }); };
  addEventListener('hashchange', handler);
  return () => removeEventListener('hashchange', handler);
 }, []);
 useEffect(() => {
  if (!notice) return;
  const timer = setTimeout(() => setNotice(''), 7000);
  return () => clearTimeout(timer);
 }, [notice]);

 function go(id) { location.hash = id; setPage(id); window.scrollTo({ top: 0 }); }
 function open(id) { setSelected(id); go('vitrine'); }
 function openMap(id){setMapFocus(id||null);go('mapa');}
 function authenticate(next){
  if(!accounts.some(item=>item.id===next.id))saveAccounts([...accounts,next]);
  saveSession({accountId:next.id,ready:false});
  setNotice('');
 }
 function updateAccount(next){saveAccounts(accounts.map(item=>item.id===next.id?next:item));}
 function chooseRole(role){updateAccount({...account,role});saveSession({...session,ready:true});go(role==='vendedor'?'cadastro':'busca');}
 function logout(){saveSession(null);setNotice('');go('busca');}
 function contact(b, dish) {
  const number = phoneDigits(b.phone || '');
  if (!number) return setNotice('Demonstração: este estabelecimento ainda não tem um WhatsApp válido cadastrado.');
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(`Olá! Vi ${dish ? `o prato ${dish.name}` : 'seu cardápio'} no OHFOME e gostaria de saber mais.`)}`, '_blank', 'noopener,noreferrer');
 }

 if(!account)return <Auth accounts={accounts} onAuthenticate={authenticate} storageError={accountsError||sessionError}/>;
 if(!session.ready||!account.role)return <ChooseRole account={account} onChoose={chooseRole} onBack={logout}/>;

 return <div className={`app-shell page-${page}`}>
  <header className="header"><a href="#busca" className="logo" aria-label="OHFOME início">ohfome<span>✳</span></a><div className="header-location"><span>OS SABORES DE</span><strong><MapPin size={12}/> Teresina, PI</strong></div><button className="profile-button" aria-label="Abrir meu perfil" onClick={() => go('perfil')}><UserRound size={21} strokeWidth={1.5}/><i/></button></header>
  <main>
   {(businessError || menuError || accountsError || sessionError) && <p role="alert" className="error">O navegador não permitiu salvar os dados. Alterações ficam disponíveis apenas nesta sessão.</p>}
   {page === 'busca' && <SearchPage businesses={businesses} open={open} contact={contact} openMap={()=>openMap()}/>}
   {page === 'mapa' && <MapPage businesses={businesses} open={open} focusId={mapFocus}/>}
   {page === 'vitrine' && <Storefront key={activeBusiness.id} business={activeBusiness} contact={contact} notify={setNotice} back={() => go('busca')} openMap={()=>openMap(activeBusiness.id)}/>}
   {page === 'cardapio' && isSeller && <Menu menu={menu} save={saveMenu} notify={setNotice} business={business}/>}
   {page === 'cadastro' && isSeller && <Register business={business} save={saveBusiness} notify={setNotice} preview={() => open('raimundo')}/>}
   {page === 'perfil' && <Profile key={account.id} account={account} onSave={updateAccount} onChangeRole={()=>{saveSession({...session,ready:false});window.scrollTo({top:0});}} onLogout={logout} go={go}/>}
   <aside className="local-banner"><span className="local-icon"><Sprout size={23} strokeWidth={1.5}/></span><div><strong>É daqui. É da gente.</strong><p>Descubra sabores. Apoie pequenos negócios.</p></div><span className="local-star">✳</span></aside>
  </main>
  <footer><p>* Estabelecimentos, preços, localizações e distâncias fictícios para demonstração.</p><p>Imagens ilustrativas. Horários e status simulados.</p><span>Feito com fome de valorizar o local. <span>ohfome ✳</span></span></footer>
  <nav className="bottom-nav" aria-label="Navegação principal">{tabs.map(({ id, label, icon: Icon }) => <a href={`#${id}`} key={id} className={(page === id||(id==='perfil'&&page==='cadastro')) ? 'active' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => { if (id === 'vitrine') setSelected('raimundo'); if(id==='mapa')setMapFocus(null); }}><span className="nav-icon"><Icon size={21} strokeWidth={page === id ? 2 : 1.5}/></span><span>{label}</span></a>)}</nav>
  {notice && <div role="status" className="toast"><span>{notice}</span><button className="icon-button" onClick={() => setNotice('')} aria-label="Fechar mensagem"><X size={18}/></button></div>}
 </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
