import { useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Clock3, Store, MessageCircle, UtensilsCrossed, MapPin, X } from 'lucide-react';
import { categories, photos } from '../data/demo';
import { FoodImage, Modal } from '../components/UI';
import RestaurantMap from '../components/RestaurantMap';
import { hasCoordinates } from '../data/locations';
import { phoneDigits } from '../utils/helpers';

export default function Register({ business, save, notify, preview }) {
 const [error, setError] = useState('');
 const [success, setSuccess] = useState(false);
 const [started, setStarted] = useState(false);
 const title = useRef(null);
 const [location,setLocation]=useState(hasCoordinates(business)?{latitude:String(business.latitude),longitude:String(business.longitude)}:{latitude:'',longitude:''});
 const [picker,setPicker]=useState(false);
 const [draft,setDraft]=useState(null);
 function start() { setStarted(true); window.scrollTo({top:0}); requestAnimationFrame(() => title.current?.focus()); }
 function submit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  if (!data.name.trim() || !data.hours.trim()) return setError('Preencha o nome e o horário de funcionamento.');
  if (!phoneDigits(data.phone)) return setError('Informe um WhatsApp válido com DDD. Exemplo de formato: (86) 9XXXX-XXXX.');
  const filled=location.latitude.trim()!==''||location.longitude.trim()!=='';
  const latitude=Number(location.latitude.replace(',','.')); const longitude=Number(location.longitude.replace(',','.'));
  if(filled&&(!location.latitude.trim()||!location.longitude.trim()||!hasCoordinates({latitude,longitude})))return setError('Informe latitude entre -90 e 90 e longitude entre -180 e 180, ou deixe ambas vazias.');
  save({ ...business, ...data, name: data.name.trim(), hours: data.hours.trim(), address:(data.address||'').trim(), latitude:filled?latitude:null,longitude:filled?longitude:null });
  setError(''); setSuccess(true); window.scrollTo({top:0}); notify('Sua vitrine foi criada e atualizada!');
 }
 if (!started) return <section className="onboarding">
  <div className="onboarding-photo"><FoodImage src={photos.pacoca} alt="Paçoca de carne regional, imagem ilustrativa"/><span className="photo-tag">Imagem ilustrativa</span></div>
  <div className="onboarding-content"><div className="onboarding-brand"><Store size={25} strokeWidth={1.5}/></div><span className="eyebrow">QUEM FAZ COM AMOR MERECE SER VISTO</span><h1>Seu tempero.<br/><em>Sua vitrine.</em></h1><p>Seu cardápio online em minutos,<br/>sem precisar de site ou Instagram.</p><div className="onboarding-benefits"><span><UtensilsCrossed size={16}/> Seu cardápio</span><span><MessageCircle size={16}/> Seu WhatsApp</span></div><button className="primary" onClick={start}>Começar meu cadastro <ArrowRight size={18}/></button><span className="time-note"><Clock3 size={14}/> Leva menos de 5 minutos</span></div>
 </section>;
 return <section className="register-form">
  <div className="form-topbar"><button className="icon-button" aria-label="Voltar à apresentação" onClick={() => setStarted(false)}><ArrowLeft size={19}/></button><span>SEU NEGÓCIO NO OHFOME</span><span>0{success ? 2 : 1}<small> / 02</small></span></div>
  <div className="steps" aria-label={success ? 'Etapa 2 de 2: vitrine criada' : 'Etapa 1 de 2: dados do negócio'}><span className="step-active"/><span className={success ? 'step-active' : ''}/></div>
  {success ? <div className="success-panel"><div className="success-icon"><Check size={34}/></div><span className="eyebrow">BEM-VINDO AO OHFOME</span><h1>Pronto para dar<br/>água na boca!</h1><p>A vitrine de <strong>{business.name}</strong> já está atualizada neste navegador.</p><button className="primary" onClick={preview}>Ver minha vitrine <ArrowRight size={18}/></button><button className="text-button" onClick={() => setSuccess(false)}>Editar meus dados</button></div> : <><span className="eyebrow">VAMOS COMEÇAR?</span><h1 ref={title} tabIndex={-1}>Conte um pouco<br/>do seu negócio.</h1><p className="muted">Você cuida do tempero.<br/>A gente cuida da sua vitrine.</p><form className="form" onSubmit={submit}><label>Nome do negócio<input name="name" required maxLength="80" defaultValue={business.name} placeholder="Como seu negócio se chama?" autoComplete="organization"/></label><label>Categoria<select name="category" defaultValue={business.category}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label>Horário de funcionamento<input name="hours" required maxLength="80" defaultValue={business.hours} placeholder="Ex.: Segunda a sábado, 11h–15h"/></label><label>WhatsApp com DDD<input name="phone" type="tel" required maxLength="22" defaultValue={business.phone} placeholder="(86) 99999-9999" autoComplete="tel"/><small>Seus clientes falam direto com você.</small></label><fieldset className="business-location"><legend>Onde fica seu negócio? <span>Opcional</span></legend><label>Endereço<input name="address" maxLength={180} defaultValue={business.address||''} placeholder="Rua, número e bairro, Teresina" autoComplete="street-address"/></label><button className="location-picker-button" type="button" onClick={()=>{setDraft(hasCoordinates({latitude:Number(location.latitude),longitude:Number(location.longitude)})&&location.latitude&&location.longitude?{latitude:Number(location.latitude),longitude:Number(location.longitude)}:null);setPicker(true);}}><MapPin size={18}/> Escolher ponto no mapa <ArrowRight size={16}/></button><div className="form-row"><label>Latitude<input name="latitude" value={location.latitude} onChange={e=>setLocation({...location,latitude:e.target.value})} inputMode="decimal" placeholder="Ex.: -5,0892"/></label><label>Longitude<input name="longitude" value={location.longitude} onChange={e=>setLocation({...location,longitude:e.target.value})} inputMode="decimal" placeholder="Ex.: -42,8058"/></label></div>{(location.latitude||location.longitude)&&<button type="button" className="text-button" onClick={()=>setLocation({latitude:'',longitude:''})}><X size={13}/> Limpar coordenadas</button>}<p className="form-note">Sem coordenadas, sua vitrine usa um ponto fictício identificado no mapa. A localização informada não é verificada.</p></fieldset>{error && <p className="error" role="alert">{error}</p>}<button className="primary" type="submit">Criar minha vitrine <ArrowRight size={18}/></button><p className="form-note">Demonstração · Dados salvos apenas neste navegador.</p></form></>}{picker&&<Modal title="Localização do negócio" close={()=>setPicker(false)}><p className="muted">Toque no mapa para escolher o ponto do estabelecimento.</p><RestaurantMap picker places={draft?[{id:'ponto',name:'Ponto selecionado',...draft}]:[]} onPick={setDraft}/><p className="picker-coordinates">{draft?`${draft.latitude.toFixed(6)}, ${draft.longitude.toFixed(6)}`:'Nenhum ponto selecionado'}</p><button type="button" className="primary" disabled={!draft} onClick={()=>{setLocation({latitude:String(draft.latitude),longitude:String(draft.longitude)});setPicker(false);}}>Usar este ponto <Check size={17}/></button></Modal>}
 </section>;
}
