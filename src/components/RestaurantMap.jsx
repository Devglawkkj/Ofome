import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const TERESINA_CENTER = [-5.0892, -42.8058];

export default function RestaurantMap({ places = [], selectedId, onSelect, onPick, picker = false, resetKey = 0 }) {
 const container = useRef(null); const mapRef = useRef(null); const markers = useRef(new Map());
 const callbacks = useRef({onSelect,onPick}); callbacks.current={onSelect,onPick};
 const [tileError,setTileError]=useState(false); const [loading,setLoading]=useState(true);
 useEffect(() => {
  const map = L.map(container.current,{zoomControl:false,scrollWheelZoom:false}).setView(TERESINA_CENTER,14);
  mapRef.current=map;
  L.control.zoom({position:'topright',zoomInTitle:'Aproximar mapa',zoomOutTitle:'Afastar mapa'}).addTo(map);
  const tiles=L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(map);
  let successes=0;
  tiles.on('tileload',()=>{successes++;setTileError(false);setLoading(false);});
  tiles.on('tileerror',()=>{if(!successes){setTileError(true);setLoading(false);}});
  if(picker) map.on('click',event=>callbacks.current.onPick?.({latitude:Number(event.latlng.lat.toFixed(6)),longitude:Number(event.latlng.lng.toFixed(6))}));
  const observer=new ResizeObserver(()=>map.invalidateSize()); observer.observe(container.current);
  return()=>{observer.disconnect();map.remove();mapRef.current=null;};
 },[picker]);
 useEffect(()=>{
  const map=mapRef.current; if(!map)return;
  markers.current.forEach(marker=>marker.remove());markers.current.clear();
  places.forEach((place,index)=>{
   const icon=L.divIcon({className:'restaurant-marker',html:`<span>${picker ? '✳' : index+1}</span>`,iconSize:[40,46],iconAnchor:[20,46]});
   const marker=L.marker([place.latitude,place.longitude],{icon,title:place.name,alt:place.name,keyboard:true}).addTo(map);
   const tooltip=document.createElement('span');tooltip.textContent=place.name;
   marker.bindTooltip(tooltip,{direction:'top',offset:[0,-40]});
   marker.on('click',()=>callbacks.current.onSelect?.(place.id));
   const el=marker.getElement();if(el){el.setAttribute('aria-label',`Localização de ${place.name}`);el.setAttribute('role','button');}
   markers.current.set(place.id,marker);
  });
  if(places.length)map.fitBounds(L.latLngBounds(places.map(place=>[place.latitude,place.longitude])),{padding:[48,48],maxZoom:15,animate:false});
 },[places,resetKey]);
 useEffect(()=>{
  markers.current.forEach((marker,id)=>marker.getElement()?.classList.toggle('is-selected',id===selectedId));
  const selected=markers.current.get(selectedId);
  if(selected){mapRef.current?.panTo(selected.getLatLng(),{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});selected.openTooltip();}
 },[selectedId,places,resetKey]);
 return <div className={`restaurant-map-wrap ${picker?'picker-map':''}`}><div ref={container} className="restaurant-map" role="region" aria-label={picker?'Escolher localização do estabelecimento no mapa de Teresina':'Mapa dos estabelecimentos em Teresina'}/>{loading && <span role="status" className="map-loading">Carregando ruas do mapa…</span>}{tileError && <div role="status" className="map-error">O mapa de ruas não carregou. Verifique sua conexão. {picker?'Você também pode informar latitude e longitude no formulário.':'Os estabelecimentos também estão na lista abaixo.'}</div>}</div>;
}
