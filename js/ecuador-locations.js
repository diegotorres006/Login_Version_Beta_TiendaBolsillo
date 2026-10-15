// Dataset geográfico de Ecuador para Tienda Bolsillo
const ECUADOR_LOCATIONS = {
  "Pichincha": {
    "Quito": ["Iñaquito", "Cumbayá", "Tumbaco", "Mariscal Sucre", "Centro Histórico", "Calderón", "Carcelén", "Conocoto", "Cotocollao", "Ponceano", "Chimbacalle"],
    "Rumiñahui": ["Sangolquí", "San Rafael", "San Pedro de Taboada", "Cotogchoa"],
    "Mejía": ["Machachi", "Aloag", "Aloasí", "Cutuglagua", "Tambillo"],
    "Cayambe": ["Cayambe", "Ascázubi", "Cangahua", "Olmedo", "Otón"]
  },
  "Guayas": {
    "Guayaquil": ["Tarqui", "Ximena", "Febres Cordero", "Urdaneta", "Chongón", "Pascuales", "Rocafuerte", "Bolívar"],
    "Samborondón": ["Samborondón", "La Puntilla", "Tarifa"],
    "Daule": ["Daule", "La Aurora", "Los Lojas", "Juan Bautista Aguirre"],
    "Durán": ["Eloy Alfaro (Durán)", "Divino Niño"],
    "Milagro": ["Milagro", "Chobo", "Mariscal Sucre"]
  },
  "Azuay": {
    "Cuenca": ["El Sagrario", "San Blas", "Gil Ramírez Dávalos", "Bellavista", "Yanuncay", "Baños", "Ricaurte", "Totoracocha"],
    "Gualaceo": ["Gualaceo", "Daniel Córdova Toral", "Jadán", "San Juan"],
    "Paute": ["Paute", "Bulán", "Chicán", "El Cabo"]
  },
  "Manabí": {
    "Portoviejo": ["Portoviejo", "12 de Marzo", "Colón", "Picoazá", "San Plácido", "Crucita"],
    "Manta": ["Manta", "Tarqui", "Los Esteros", "Eloy Alfaro", "San Mateo"],
    "Chone": ["Chone", "Santa Rita", "Ricaurte", "Boyacá"]
  },
  "Tungurahua": {
    "Ambato": ["Atocha - Ficoa", "Celiano Monge", "Huachi Chico", "Huachi Loreto", "La Matriz", "Pishilata"],
    "Baños de Agua Santa": ["Baños", "Lligua", "Río Verde", "Ulba"],
    "Pelileo": ["Pelileo", "Benítez", "Chiquicha", "Salasaca"]
  },
  "Loja": {
    "Loja": ["El Sagrario", "San Sebastián", "Sucre", "Valle", "Malacatos", "Vilcabamba"],
    "Catamayo": ["Catamayo", "San José", "El Tambo", "Zambi"]
  },
  "El Oro": {
    "Machala": ["Machala", "Puerto Bolívar", "El Cambio", "La Providencia", "9 de Mayo"],
    "Pasaje": ["Pasaje", "Bolívar", "Loma de Franco", "Buenavista"],
    "Santa Rosa": ["Santa Rosa", "Puerto Jelí", "Bellamaría", "San Antonio"]
  },
  "Santo Domingo de los Tsáchilas": {
    "Santo Domingo": ["Santo Domingo", "Chiguilpe", "Río Verde", "Zaracay", "Abraham Calazacón", "Bombolí"],
    "La Concordia": ["La Concordia", "Monterrey", "La Villegas", "Plan Piloto"]
  }
};

// Categorías comerciales especializadas
const COMMERCIAL_ACTIVITIES = [
  { id: "ferreteria", name: "Ferretería y Materiales de Construcción", icon: "tools" },
  { id: "farmacia", name: "Farmacia y Cuidado Personal", icon: "pill" },
  { id: "mascotas", name: "Veterinaria y Tienda de Mascotas", icon: "paw" },
  { id: "minimarket", name: "Minimarket, Bodega y Abarrotes", icon: "shopping-basket" },
  { id: "bazar", name: "Bazar, Papelería y Suministros", icon: "book-open" },
  { id: "repuestos", name: "Repuestos y Accesorios Automotrices", icon: "cog" },
  { id: "restaurante", name: "Cafetería, Panadería y Alimentos", icon: "coffee" },
  { id: "otro", name: "Otro comercio o servicio local", icon: "store" }
];
