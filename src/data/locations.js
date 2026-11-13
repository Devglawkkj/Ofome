// Posições sintéticas: não correspondem aos endereços de estabelecimentos reais.
export const demoLocations={
 raimundo:{latitude:-5.0889,longitude:-42.8107},
 zefa:{latitude:-5.0842,longitude:-42.8020},
 cia:{latitude:-5.0961,longitude:-42.8053},
};
export function hasCoordinates(business){return Number.isFinite(business.latitude)&&Number.isFinite(business.longitude)&&Math.abs(business.latitude)<=90&&Math.abs(business.longitude)<=180;}
export function withLocation(business){const entered=hasCoordinates(business);return {...business,...(entered?{latitude:business.latitude,longitude:business.longitude}:demoLocations[business.id]),locationSource:entered?'Informada no cadastro, não verificada':'Ponto fictício de demonstração'};}
