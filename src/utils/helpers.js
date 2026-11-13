import { useState } from 'react';
export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function phoneDigits(value) { const digits = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, ''); return /^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/.test(digits) ? `55${digits}` : null; }
export function useStored(key, initial) {
 const [value, setValue] = useState(() => { try { const stored = JSON.parse(localStorage.getItem(key)); return stored ?? initial; } catch { return initial; } });
 const [storageError, setStorageError] = useState(false);
 function save(next) { setValue(next); try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); } }
 return [value, save, storageError];
}
