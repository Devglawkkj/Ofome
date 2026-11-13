export const categories = ['Todos', 'Comida regional', 'Tapiocas', 'Lanches', 'Bebidas'];
export function resolveDishImage(dish) {
 if (dish.image && !dish.image.includes('images.unsplash.com')) return dish.image;
 const name = `${dish.name} ${dish.id}`.toLowerCase();
 if (/capote/.test(name)) return photos.capote;
 if (/paçoca|pacoca/.test(name)) return photos.pacoca;
 if (/tapioca/.test(name)) return photos.tapioca;
 if (/cajuína|cajuina/.test(name)) return photos.drink;
 if (dish.category === 'Bebidas') return photos.drink;
 if (dish.category === 'Tapiocas') return photos.tapioca;
 if (dish.category === 'Lanches') return photos.snack;
 return dish.image || photos.capote;
}
export const photos = {
 capote: '/images/sabores-regionais.png#capote',
 pacoca: '/images/sabores-regionais.png#pacoca',
 tapioca: '/images/sabores-regionais.png#tapioca',
 drink: '/images/sabores-regionais.png#drink',
 snack: '/images/lanche.jpg'
};
export const defaultBusiness = { id: 'raimundo', name: 'Barraca do Raimundo', category: 'Comida regional', hours: '11h–15h', phone: '', address: '', distance: '350 m', status: 'Aberto agora' };
export const defaultMenu = [
 { id: 'capote', name: 'Capote', description: 'Galinha caipira e arroz', price: 22, category: 'Comida regional', image: photos.capote },
 { id: 'pacoca', name: 'Paçoca de carne', description: 'Carne de sol e farofa', price: 18, category: 'Comida regional', image: photos.pacoca },
 { id: 'tapioca', name: 'Tapioca de queijo', description: 'Recheio preparado na hora', price: 9, category: 'Tapiocas', image: photos.tapioca },
 { id: 'cajuina', name: 'Cajuína 300 ml', description: 'Bebida gelada', price: 5, category: 'Bebidas', image: photos.drink }
];
export const otherBusinesses = [
 { id: 'zefa', name: 'Tapiocaria da Zefa', category: 'Tapiocas', hours: '8h–20h', phone: '', distance: '600 m', status: 'Aberto agora', menu: [{ id: 'zefa-tapioca', name: 'Tapioca', description: 'Massa levinha, queijo e muito carinho', price: 9, category: 'Tapiocas', image: photos.tapioca }] },
 { id: 'cia', name: 'Cajuína & Cia', category: 'Lanches', hours: '10h–18h', phone: '', distance: '900 m', status: 'Fecha às 18h', menu: [{ id: 'cia-lanche', name: 'Lanche', description: 'Uma pausa saborosa no seu dia', price: 12, category: 'Lanches', image: photos.snack }] }
];
