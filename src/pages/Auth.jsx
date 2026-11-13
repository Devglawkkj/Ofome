import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, MapPin, Store, UtensilsCrossed, Check } from 'lucide-react';
import { FoodImage } from '../components/UI';
import { photos } from '../data/demo';
import { phoneDigits } from '../utils/helpers';

export default function Auth({ accounts, onAuthenticate, storageError }) {
 const [screen, setScreen] = useState('welcome');
 const [error, setError] = useState('');
 const [visible, setVisible] = useState(false);
 function switchScreen(next) { setScreen(next); setError(''); setVisible(false); window.scrollTo({top:0}); }
 function submit(event) {
  event.preventDefault(); setError('');
  const form = new FormData(event.currentTarget);
  const email = String(form.get('email')).trim().toLowerCase();
  const password = String(form.get('password'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Informe um e-mail válido.');
  if (password.length < 6) return setError('Use uma senha de demonstração com pelo menos 6 caracteres.');
  const existing = accounts.find(account => account.email === email);
  if (screen === 'login') {
   if (!existing) return setError('Nenhuma conta de demonstração com esse e-mail neste navegador. Crie sua conta primeiro.');
   onAuthenticate(existing); return;
  }
  const name = String(form.get('name')).trim();
  const phone = String(form.get('phone')).trim();
  if (name.length < 2) return setError('Informe seu nome com pelo menos 2 caracteres.');
  if (phone && !phoneDigits(phone)) return setError('Informe um telefone válido com DDD ou deixe o campo vazio.');
  if (existing) return setError('Este e-mail já tem uma conta de demonstração. Use a opção Entrar.');
  // A senha permanece somente no formulário: não é persistida ou usada como autenticação.
  onAuthenticate({id:crypto.randomUUID(),name,email,phone,role:null});
 }
 return <div className={`app-shell auth-shell auth-${screen}`}>
  <header className="auth-header"><a className="logo" href="#" onClick={event => {event.preventDefault();switchScreen('welcome');}}>ohfome<span>✳</span></a><span><MapPin size={12}/> Teresina, PI</span></header>
  {screen === 'welcome' ? <><div className="auth-cover"><FoodImage src={photos.capote} alt="Capote com arroz, imagem ilustrativa"/><span className="photo-tag">Imagem ilustrativa</span><div className="auth-cover-note">Sabor daqui.<br/><strong>Conexões de verdade.</strong></div></div><main className="auth-welcome"><span className="eyebrow">UM ENCONTRO COM O SABOR LOCAL</span><h1>Deu fome?<br/><em>Chega mais.</em></h1><p>Encontre seu próximo prato favorito<br/>ou leve seu negócio para mais gente.</p><button className="primary" onClick={() => switchScreen('login')}>Entrar <ArrowRight size={18}/></button><button className="secondary" onClick={() => switchScreen('signup')}>Criar minha conta</button><span className="auth-demo-note">MVP demonstrativo · Acesso simulado</span></main></> : <main className="auth-form-page"><button className="icon-button auth-back" aria-label="Voltar ao início" onClick={() => switchScreen('welcome')}><ArrowLeft size={20}/></button><span className="eyebrow">{screen === 'signup' ? 'SUA HISTÓRIA COMEÇA AQUI' : 'BOM TER VOCÊ DE VOLTA'}</span><h1>{screen === 'signup' ? <>Uma conta.<br/>Muitos sabores.</> : <>Já estava<br/>dando saudade.</>}</h1><p className="muted">{screen === 'signup' ? 'Primeiro seus dados. Depois, escolha como quer usar o OHFOME.' : 'Entre na sua conta de demonstração para continuar.'}</p><form key={screen} className="form" onSubmit={submit}>{screen === 'signup' && <label>Seu nome<input name="name" autoComplete="name" placeholder="Como podemos chamar você?" required minLength={2} maxLength={70}/></label>}<label>E-mail<input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="voce@exemplo.com"/></label>{screen === 'signup' && <label>WhatsApp <span className="optional">Opcional</span><input name="phone" type="tel" maxLength={22} autoComplete="tel" placeholder="(86) 99999-9999"/></label>}<label htmlFor="auth-password">Senha de demonstração</label><div className="password-field"><input id="auth-password" name="password" type={visible ? 'text' : 'password'} required minLength={6} maxLength={100} autoComplete="off" placeholder="Pelo menos 6 caracteres"/><button type="button" aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div><p className="auth-password-note">Use dados fictícios. A senha não é salva nem verificada como autenticação real. No login de demonstração, qualquer senha com 6 caracteres ou mais funciona.</p>{error && <p className="error" role="alert">{error}</p>}{storageError && <p className="error" role="alert">Não foi possível salvar a conta neste navegador.</p>}<button className="primary" type="submit">{screen === 'signup' ? 'Criar conta e continuar' : 'Entrar e continuar'} <ArrowRight size={18}/></button></form><p className="auth-switch">{screen === 'signup' ? 'Já tem uma conta?' : 'Ainda não tem conta?'} <button onClick={() => switchScreen(screen === 'signup' ? 'login' : 'signup')}>{screen === 'signup' ? 'Entrar' : 'Criar conta'}</button></p></main>}
  <p className="auth-footnote">Dados salvos apenas neste navegador.<br/>Sem autenticação real ou envio de dados para um servidor.</p>
 </div>;
}

export function ChooseRole({ account, onChoose, onBack }) {
 const [role, setRole] = useState(account.role || 'cliente');
 return <div className="app-shell role-shell"><header className="auth-header"><span className="logo">ohfome<span>✳</span></span><button className="text-button" onClick={onBack}>Sair</button></header><main><div className="role-illustration"><span><UtensilsCrossed size={30} strokeWidth={1.3}/></span><i>✳</i><span><Store size={30} strokeWidth={1.3}/></span></div><span className="eyebrow">PRAZER, {account.name.split(' ')[0]}!</span><h1>Qual é o seu<br/><em>lado dessa mesa?</em></h1><p className="muted">Escolha como quer usar o OHFOME.<br/>Você pode trocar de perfil depois.</p><div className="role-options" role="radiogroup" aria-label="Tipo de perfil" onKeyDown={event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();const next=role==='cliente'?'vendedor':'cliente';setRole(next);event.currentTarget.querySelectorAll('[role="radio"]')[next==='cliente'?0:1]?.focus();}}}><button role="radio" tabIndex={role==='cliente'?0:-1} aria-checked={role === 'cliente'} className={role === 'cliente' ? 'selected' : ''} onClick={() => setRole('cliente')}><span className="role-option-icon"><UtensilsCrossed size={25} strokeWidth={1.5}/></span><span><strong>Sou cliente</strong><small>Quero descobrir sabores e pedir direto pelo WhatsApp.</small></span><span className="role-check">{role === 'cliente' && <Check size={13}/>}</span></button><button role="radio" tabIndex={role==='vendedor'?0:-1} aria-checked={role === 'vendedor'} className={role === 'vendedor' ? 'selected' : ''} onClick={() => setRole('vendedor')}><span className="role-option-icon"><Store size={25} strokeWidth={1.5}/></span><span><strong>Sou vendedor</strong><small>Tenho um estabelecimento e quero criar minha vitrine.</small></span><span className="role-check">{role === 'vendedor' && <Check size={13}/>}</span></button></div><button className="primary" onClick={() => onChoose(role)}>Continuar como {role} <ArrowRight size={18}/></button><p className="form-note">{role === 'vendedor' ? 'Na próxima etapa, vamos cadastrar seu estabelecimento.' : 'Seu perfil de cliente está pronto. Bora descobrir os sabores?'}</p></main></div>;
}
