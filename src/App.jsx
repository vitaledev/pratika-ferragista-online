
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Search, Menu, X, Zap, Droplet, Hammer, Star, 
  CheckCircle, Loader2, AlertCircle, Truck, CreditCard, ShieldCheck, 
  ArrowRight, Filter, ChevronLeft, ChevronRight, ShoppingCart, User, MapPin, Grid, ImageOff, Clock, Home, Trash2, Plus, Minus, MessageCircle, Flame, Tag, ChevronDown, Banknote
} from 'lucide-react';

// --- CONFIGURAÇÃO DA PLANILHA ---
const GOOGLE_SHEET_CSV_URL =
  import.meta.env.VITE_GOOGLE_SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/1cv7p2SNg8-6Y8O134NAh_Fn2ptRLqPEEKWgU4Xv_onU/export?format=csv";

// Produtos de Backup
const BACKUP_PRODUCTS = [
  {
    id: 1,
    name: "Balde Reforçado 12L",
    category: "Geral",
    price: 8.50,
    oldPrice: 12.90,
    image: "https://i.imgur.com/CwHXRwm.png",
    featured: true,
    consult: false
  },
  {
    id: 2,
    name: "Lâmpada LED Kian 9W",
    category: "Elétrica",
    price: 2.85,
    oldPrice: 5.50,
    image: "https://i.imgur.com/87NTXa1.png",
    featured: true,
    consult: false
  },
  {
    id: 3,
    name: "Disco Corte Famastil",
    category: "Ferramentas",
    price: 1.45,
    oldPrice: 3.20,
    image: "https://i.imgur.com/7LZP7kp.jpeg",
    featured: true,
    consult: false
  },
  {
    id: 4,
    name: "Engate Aço 60cm",
    category: "Hidráulica",
    price: 17.50,
    oldPrice: 22.00,
    image: "https://i.imgur.com/OyI3UTc.jpeg",
    featured: false,
    consult: false
  },
  {
    id: 5,
    name: "Kit Conexões Variadas",
    category: "Hidráulica",
    price: 0.00,
    oldPrice: 0.00,
    image: "https://i.imgur.com/Ca1CfGD.png",
    featured: false,
    consult: true
  }
];
// --- DADOS DO BANNER ANIMADO ---
const BANNER_SLIDES = [
  {
    id: 1,
    tag: "FERRAGISTA ONLINE",
    title: "Não Saia da Obra!",
    subtitle: "Entrega rápida com preço de atacado.",
    image: "https://i.imgur.com/jARyWif.jpeg", 
    accent: "bg-green-600",
    buttonText: "Ver Ofertas",
    textColor: "text-slate-900"
  },
  {
    id: 2,
    tag: "ELÉTRICA EXPRESS",
    title: "Faltou fio ou lâmpada?",
    subtitle: "Peça agora e receba em minutos.",
    image: "https://i.imgur.com/cgY6bmN.jpeg",
    accent: "bg-yellow-500",
    buttonText: "Ver Elétricos",
    textColor: "text-white"
  },
  {
    id: 3,
    tag: "SOS HIDRÁULICA",
    title: "Cano furou? A Prátika salvou.",
    subtitle: "Tubos e conexões para emergências.",
    image: "https://i.imgur.com/iOW7MZd.jpeg",
    accent: "bg-blue-600",
    buttonText: "Comprar Hidráulica",
    textColor: "text-white"
  }
];

// --- CATEGORIAS COM SUBCATEGORIAS ---
const CATEGORIES = [
  { 
    id: 'todos', 
    name: 'Todos os Itens', 
    icon: <Grid size={16}/>,
    subcategories: []
  },
  { 
    id: 'ofertas', 
    name: 'Só Ofertas', 
    icon: <Flame size={16} className="text-red-500"/>,
    subcategories: []
  },
  { 
    id: 'Elétrica', 
    name: 'Elétrica', 
    icon: <Zap size={16} />,
    subcategories: [
      { name: 'Lâmpadas', keyword: 'lâmpada' },
      { name: 'Fios e Cabos', keyword: 'fio' },
      { name: 'Tomadas', keyword: 'tomada' },
      { name: 'Disjuntores', keyword: 'disjuntor' },
      { name: 'Chuveiros', keyword: 'chuveiro' }
    ]
  },
  { 
    id: 'Hidráulica', 
    name: 'Hidráulica', 
    icon: <Droplet size={16} />,
    subcategories: [
      { name: 'Tubos PVC', keyword: 'tubo' },
      { name: 'Conexões', keyword: 'conex' }, 
      { name: 'Torneiras', keyword: 'torneira' },
      { name: 'Registros', keyword: 'registro' },
      { name: 'Caixas D\'água', keyword: 'caixa' }
    ]
  },
  { 
    id: 'Ferramentas', 
    name: 'Ferramentas', 
    icon: <Hammer size={16} />,
    subcategories: [
      { name: 'Manuais', keyword: 'chave' },
      { name: 'Elétricas', keyword: 'furadeira' },
      { name: 'Discos', keyword: 'disco' },
      { name: 'Medição', keyword: 'trena' },
      { name: 'Pedreiro', keyword: 'colher' }
    ]
  },
  { 
    id: 'Geral', 
    name: 'Uso Geral', 
    icon: <Star size={16} />,
    subcategories: [
      { name: 'Cimento e Argamassa', keyword: 'cimento' },
      { name: 'EPIs', keyword: 'luva' },
      { name: 'Tintas', keyword: 'tinta' },
      { name: 'Parafusos', keyword: 'parafuso' }
    ]
  },
];

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "5562982055254"; 
const WHATSAPP_ICON_URL =
  import.meta.env.VITE_WHATSAPP_ICON_URL || "https://i.imgur.com/GNj685k.png";
const ASSET_BASE = import.meta.env.BASE_URL;

// --- AJUSTES RÁPIDOS DA LOGO ---
// Edite esses valores para ajustar tamanho/posição da logo no header e no rodapé.
// Use "scale" para aumentar/diminuir a imagem dentro do círculo.
const LOGO_SETTINGS = {
  header: {
    size: 60,
    sizeMd: 70,
    border: 0,
    borderColor: "#FACC15",
    radius: 9999,
    padding: 0,
    fit: "cover",
    scale: 1.7,
    x: 0,
    y: 0,
  },
  footer: {
    size: 36,
    sizeMd: 36,
    border: 0,
    borderColor: "#FFFFFF",
    radius: 9999,
    padding: 0,
    fit: "cover",
    scale: 1,
    x: 0,
    y: 0,
  },
};

const buildLogoVars = (settings) => ({
  "--logo-size": `${settings.size}px`,
  "--logo-size-md": `${settings.sizeMd}px`,
  "--logo-border": `${settings.border}px`,
  "--logo-border-color": settings.borderColor,
  "--logo-radius": `${settings.radius}px`,
  "--logo-padding": `${settings.padding}px`,
});

const buildLogoImgStyle = (settings) => ({
  objectFit: settings.fit,
  transform: `translate(${settings.x}px, ${settings.y}px) scale(${settings.scale})`,
  transformOrigin: "center",
});

// --- UTILITÁRIOS ---
const fixImageUrl = (url) => {
  if (!url) return "";
  let cleanUrl = url.trim();
  cleanUrl = cleanUrl.replace(/^["']|["']$/g, '');
  if (cleanUrl.includes("drive.google.com")) {
    const idMatch = cleanUrl.match(/[-\w]{25,}/);
    if (idMatch) return `https://drive.google.com/uc?export=view&id=${idMatch[0]}`;
  }
  return cleanUrl;
};

const parseCSV = (text) => {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') { currentCell += '"'; i++; } 
      else { insideQuotes = !insideQuotes; }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim()); currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim()); rows.push(currentRow); currentRow = []; currentCell = '';
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else { currentCell += char; }
  }
  if (currentCell || currentRow.length > 0) { currentRow.push(currentCell.trim()); rows.push(currentRow); }
  return rows;
};

const csvToJson = (stringVal) => {
  const rawRows = parseCSV(stringVal);
  if (rawRows.length < 2) return [];
  const headers = rawRows[0].map(h => h.toLowerCase().replace(/^"|"$/g, '').trim());
  const body = rawRows.slice(1);
  return body.map(row => {
    const obj = {};
    headers.forEach((header, index) => { obj[header] = row[index] || ""; });
    return obj;
  });
};

const isTrue = (value) => {
  if (!value) return false;
  const v = value.toString().toLowerCase().trim();
  return v === 'sim' || v === 's' || v === 'true' || v === 'verdadeiro';
};

const parsePrice = (value) => {
  if (!value) return 0;
  const clean = value.toString().replace('R$', '').trim().replace(',', '.');
  const floatVal = parseFloat(clean);
  return isNaN(floatVal) ? 0 : floatVal;
};

// --- COMPONENTE CARTÃO DE PRODUTO INDIVIDUAL ---
const ProductCard = ({ product, onAddToCart, onBuyNow, large = false }) => {
  const [quantity, setQuantity] = useState(1);
  const isPromo = product.oldPrice && product.oldPrice > product.price;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reseta a quantidade após adicionar
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm hover:shadow-xl transition flex flex-col relative group overflow-hidden ${isPromo ? 'border-red-500 border-2 shadow-red-100' : 'border-slate-200'}`}>
      
      {/* Etiquetas / Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isPromo && (
            <span className={`bg-gradient-to-r from-red-600 to-orange-600 text-white font-black rounded shadow-md flex items-center gap-1 animate-pulse ${large ? 'text-sm px-4 py-1.5' : 'text-[10px] px-3 py-1'}`}>
                <Flame size={large ? 16 : 10} fill="white" /> OFERTAÇO
                <span className="bg-white text-red-600 px-1 rounded ml-1">-{(100 - (product.price/product.oldPrice * 100)).toFixed(0)}%</span>
            </span>
          )}
          {product.featured && !isPromo && <span className="bg-yellow-400 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-yellow-500">ENTREGA HOJE</span>}
      </div>

      {/* Imagem */}
      <div className={`${large ? 'h-56 md:h-72' : 'h-40 md:h-48'} p-4 flex items-center justify-center bg-white relative transition-all duration-300`}>
          <img 
              src={product.image || "https://placehold.co/400x400?text=Sem+Foto"} 
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
              onError={(e) => {
                  e.target.onerror = null; 
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-slate-100');
                  const iconContainer = document.createElement('div');
                  iconContainer.className = "flex flex-col items-center justify-center text-slate-400 h-full w-full absolute inset-0";
                  iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><path d="m21 21-9-9m0 0L3 21"/></svg><span class="text-[10px] mt-1">Sem Imagem</span>';
                  e.target.parentElement.appendChild(iconContainer);
              }}
          />
      </div>

      <div className={`p-3 flex flex-col flex-grow border-t ${isPromo ? 'bg-red-50/30' : 'border-slate-100'}`}>
          <p className="text-[10px] text-slate-400 mb-1 font-mono">Cód: {product.id.toString().padStart(4, '0')}</p>
          <h3 className={`font-bold text-slate-800 line-clamp-2 leading-tight ${large ? 'text-lg md:text-xl h-auto mb-3' : 'text-xs md:text-sm h-9 mb-2'}`} title={product.name}>
              {product.name}
          </h3>

          <div className="mt-auto">
              {product.consult ? (
                  <p className="text-blue-800 font-bold text-sm mb-4">Consulte Preço</p>
              ) : (
                  <div className="mb-3">
                      {isPromo && <p className="text-[12px] text-slate-400 line-through">De: R$ {product.oldPrice.toFixed(2).replace('.',',')}</p>}
                      <p className={`font-black ${isPromo ? 'text-red-600' : 'text-[#003366]'} ${large ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'}`}>
                          R$ {product.price?.toFixed(2).replace('.',',')}
                          <span className={`font-normal text-slate-500 ml-1 ${large ? 'text-sm' : 'text-[10px]'}`}>/un</span>
                      </p>
                      <p className="text-[10px] text-green-600 font-semibold">à vista no Pix</p>
                  </div>
              )}
              
              <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-white border border-slate-300 rounded h-10 mb-1">
                      <button onClick={handleDecrement} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-l transition-colors">
                          <Minus size={16} />
                      </button>
                      <span className="text-base font-bold text-slate-800 w-full text-center">{quantity}</span>
                      <button onClick={handleIncrement} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-r transition-colors">
                          <Plus size={16} />
                      </button>
                  </div>

                  <div className={`grid ${large ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-2'}`}>
                    <button 
                        onClick={handleAdd}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-200 text-xs font-bold py-3 rounded flex items-center justify-center gap-2 transition"
                    >
                        <ShoppingCart size={16} /> ADD SACOLA
                    </button>
                    <button 
                        onClick={handleBuy}
                        className={`w-full text-white text-xs font-bold py-3 rounded flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform active:scale-95 ${isPromo ? 'bg-red-600 hover:bg-red-700 animate-pulse-slow' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        <MessageCircle size={16} /> PEDIR NO ZAP
                    </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const cartPulseRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (cartPulseRef.current) {
        clearTimeout(cartPulseRef.current);
      }
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error('Erro na conexão');
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE html>")) throw new Error("Erro planilha");
        const data = csvToJson(text);
        const formattedData = data.map((item, index) => ({
          id: item.id || index + 1,
          name: item.nome || "Produto sem nome",
          category: item.categoria || "Geral",
          image: fixImageUrl(item.foto),
          price: parsePrice(item.preco),
          oldPrice: item.preco_antigo ? parsePrice(item.preco_antigo) : null,
          featured: isTrue(item.destaque),
          consult: isTrue(item.sob_consulta)
        }));
        const validProducts = formattedData.filter(p => p.name !== "Produto sem nome" || p.price > 0);
        setProducts(validProducts);
      } catch (err) {
        console.error(err);
        setProducts(BACKUP_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const prodCategory = product.category || "";
    const prodName = product.name || "";
    
    if (subCategoryFilter) {
      return prodName.toLowerCase().includes(subCategoryFilter.toLowerCase());
    }

    if (activeCategory === 'ofertas') {
        return product.oldPrice && product.oldPrice > product.price;
    }

    const matchesCategory = activeCategory === 'todos' || prodCategory.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = prodName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const offerProducts = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  const highlightedOffers = offerProducts.slice(0, 4);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity: quantity }];
    });
    setCartPulse(true);
    if (typeof window !== 'undefined' && window.matchMedia) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (isMobile) {
        setIsCartOpen(false);
      }
    }
    if (cartPulseRef.current) {
      clearTimeout(cartPulseRef.current);
    }
    cartPulseRef.current = setTimeout(() => {
      setCartPulse(false);
    }, 600);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    if (item.consult) return total; 
    return total + (item.price * item.quantity);
  }, 0);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    let message = "Olá Prátika! Gostaria de fazer o seguinte pedido pelo site:\n\n";
    message += "📦 *RESUMO DO PEDIDO*\n";
    
    cart.forEach(item => {
      const totalItem = item.consult ? "A consultar" : `R$ ${(item.price * item.quantity).toFixed(2)}`;
      message += `-----------------------------------\n`;
      message += `*${item.quantity}x ${item.name}*\n`;
      message += `(Cód: ${item.id}) - Valor: ${totalItem}\n`;
    });
    
    message += `-----------------------------------\n`;
    const hasConsultItems = cart.some(item => item.consult);
    
    if (hasConsultItems) {
      message += `\n💰 *Total Parcial: R$ ${cartTotal.toFixed(2)}*`;
      message += `\n(Existem itens sob consulta no pedido)`;
    } else {
      message += `\n💰 *TOTAL DO PEDIDO: R$ ${cartTotal.toFixed(2)}*`;
    }
    
    message += `\n\n📍 *Gostaria de combinar a entrega!*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleBuyClick = (product, quantity = 1) => {
    const total = product.consult ? "A consultar" : `R$ ${(product.price * quantity).toFixed(2)}`;
    const message = `Olá! Preciso de *${quantity}x ${product.name}* (Cód: ${product.id}).\nValor Total: ${total}.\n\nPode entregar agora?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSubCategoryFilter('');
    setSearchTerm('');
    setTimeout(() => {
      const section = document.getElementById('produtos');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSubCategoryClick = (keyword) => {
    setSubCategoryFilter(keyword);
    document.getElementById('produtos').scrollIntoView({behavior: 'smooth'});
  };

  const handleViewAllOffers = () => {
    setActiveCategory('ofertas');
    setSubCategoryFilter('');
    document.getElementById('produtos').scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-slate-800 pb-32">
      
      {/* --- FAIXA DE ALERTA --- */}
      <div className="bg-yellow-400 text-[#002855] text-[10px] md:text-xs font-bold py-1 border-b border-yellow-500">
        <div className="container mx-auto px-4 flex justify-center items-center text-center gap-2">
            <Truck size={16} strokeWidth={2.5}/>
            <span>ENTREGA RELÂMPAGO EM GOIÂNIA!</span>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="bg-[#003366] text-white sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Logo e Sacola (mobile) */}
            <div className="flex justify-between w-full md:w-auto items-center">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
                    <div
                      className="logo-wrap bg-white shadow-lg overflow-hidden relative group-hover:scale-100 transition-transform z-50"
                      style={buildLogoVars(LOGO_SETTINGS.header)}
                    >
                        <img 
                          src={`${ASSET_BASE}logo-pratika.png`} 
                          alt="Logo Prátika" 
                          className="logo-img"
                          style={buildLogoImgStyle(LOGO_SETTINGS.header)}
                        />
                    </div>
                    <div className="leading-none flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-yellow-400 uppercase italic transform -skew-x-6 drop-shadow-md">Prátika</h1>
                        <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/90 mt-1 ml-1">Ferragista Online</p>
                    </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className={`md:hidden relative bg-green-500 text-white p-2 rounded-full shadow-lg transition ${
                    cartPulse ? 'cart-pulse' : 'active:scale-95'
                  }`}
                  aria-label="Abrir sacola"
                >
                  <ShoppingCart size={22} strokeWidth={2.5}/>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#003366]">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto min-w-0">
                <div className="flex items-center gap-2">
                    <button
                      className="md:hidden text-white bg-[#002855] px-3 py-2 rounded-lg"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      aria-label="Abrir menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex flex-1">
                        <input 
                            type="text" 
                            placeholder="O que sua obra precisa agora?" 
                            className="w-full px-4 py-2 rounded-l-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none border-0 font-medium text-sm shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-r-lg flex items-center gap-2 transition-colors">
                            <Search size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div 
                onClick={() => setIsCartOpen(true)}
                className={`hidden md:flex items-center gap-2 cursor-pointer transition transform bg-green-500 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg relative ${
                  cartPulse ? 'cart-pulse' : 'hover:scale-105'
                }`}
            >
                <ShoppingCart size={24} strokeWidth={2.5}/>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#003366]">
                    {cartItemsCount}
                  </span>
                )}
                <div className="hidden sm:block text-xs leading-tight font-bold">
                    <p>MEU PEDIDO</p>
                    <p>R$ {cartTotal.toFixed(2)}</p>
                </div>
            </div>

          </div>
        </div>


        {/* --- MENU CATEGORIAS --- */}
        <div className="bg-[#002855] border-t border-white/10 hidden md:block pt-1 pb-1 relative z-40">
            <div className="container mx-auto px-4 pl-32">
                <div className="flex justify-center items-center gap-4">
                    {CATEGORIES.map(cat => (
                        <div key={cat.id} className="group relative">
                            <button
                                onClick={() => handleCategoryClick(cat.id)}
                                aria-pressed={activeCategory === cat.id}
                                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#002855] active:scale-95 ${
                                    activeCategory === cat.id 
                                    ? 'text-[#003366] bg-yellow-300 shadow-md ring-2 ring-yellow-200/80'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cat.icon}
                                {cat.name}
                                {cat.subcategories.length > 0 && <ChevronDown size={12} className="opacity-50 group-hover:opacity-100" />}
                            </button>
                            
                            {cat.subcategories.length > 0 && (
                                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-800 shadow-xl rounded-b-lg w-48 border-t-2 border-green-500 overflow-hidden">
                                    {cat.subcategories.map((sub, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); handleSubCategoryClick(sub.keyword); }}
                                            className="block w-full text-left px-4 py-2 text-xs border-b border-slate-100 last:border-0 hover:bg-slate-100 hover:text-green-600 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70 active:scale-[0.98]"
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-200">
                <div className="p-4 grid gap-2">
                    {CATEGORIES.map(cat => (
                        <div key={cat.id} className="border-b border-slate-100 last:border-0 pb-2">
                            <button
                                onClick={() => {handleCategoryClick(cat.id); setIsMenuOpen(false)}}
                                aria-pressed={activeCategory === cat.id}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold uppercase text-left w-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 active:scale-[0.98] ${
                                    activeCategory === cat.id ? 'bg-yellow-100 text-[#003366] shadow-sm ring-1 ring-yellow-200' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                            {cat.subcategories.length > 0 && activeCategory === cat.id && (
                                <div className="pl-10 pr-4 grid grid-cols-2 gap-2 mt-1">
                                    {cat.subcategories.map((sub, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {handleSubCategoryClick(sub.keyword); setIsMenuOpen(false)}}
                                            className="text-xs bg-slate-100 p-2 rounded text-slate-600 hover:bg-slate-200 transition active:scale-[0.98]"
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button 
                        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                        className="mt-2 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-bold"
                    >
                        <Phone size={18} /> Falar com Vendedor
                    </button>
                </div>
            </div>
        )}
      </header>

      {/* --- BANNER --- */}
      <section className="relative w-full h-[200px] sm:h-[240px] md:h-[380px] overflow-hidden bg-slate-200 group">
         {BANNER_SLIDES.map((slide, index) => (
            <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/95 via-[#003366]/60 to-transparent flex items-center">
                    <div className="container mx-auto px-4 md:px-12">
                        <div className="max-w-xl text-white pt-4">
                            <span className={`${slide.accent} text-white text-xs md:text-sm font-black px-3 py-1 rounded uppercase mb-3 inline-block shadow-sm tracking-wider`}>
                                {slide.tag}
                            </span>
                            <h2 className="text-lg sm:text-xl md:text-5xl font-extrabold mb-2 sm:mb-3 leading-tight drop-shadow-lg">
                                {slide.title}
                            </h2>
                            <p className="text-xs sm:text-sm md:text-xl text-slate-100 mb-3 sm:mb-6 font-medium drop-shadow-md max-w-md">
                                {slide.subtitle}
                            </p>
                            <button 
                                onClick={() => {document.getElementById('produtos').scrollIntoView({behavior: 'smooth'})}} 
                                className="bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs md:text-base font-bold py-2 sm:py-2.5 md:py-4 px-3 sm:px-5 md:px-8 rounded shadow-xl transition transform hover:scale-105 flex items-center gap-2"
                            >
                                <ShoppingCart /> {slide.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         ))}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#003366] p-2 md:p-3 rounded-full shadow-lg transition hidden md:flex"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#003366] p-2 md:p-3 rounded-full shadow-lg transition hidden md:flex"
          aria-label="Próximo slide"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* --- VANTAGENS --- */}
      <section className="bg-white py-6 shadow-sm border-b border-slate-200 -mt-1 relative z-20">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="flex flex-col items-center text-center p-2">
                    <div className="bg-blue-100 p-3 rounded-full mb-2 text-blue-700">
                        <Home size={32} />
                    </div>
                    <h3 className="font-bold text-[#003366]">Receba em Casa</h3>
                    <p className="text-xs text-slate-500">Sem sair da obra</p>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                    <div className="bg-green-100 p-3 rounded-full mb-2 text-green-700">
                        <Truck size={32} />
                    </div>
                    <h3 className="font-bold text-[#003366]">Entrega Flash</h3>
                    <p className="text-xs text-slate-500">Chega rapidinho</p>
                </div>
                <div 
                    className="flex flex-col items-center text-center p-2 cursor-pointer hover:scale-105 transition"
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                >
                    <div className="bg-green-100 p-3 rounded-full mb-2 text-green-700">
                        <MessageCircle size={32} />
                    </div>
                    <h3 className="font-bold text-[#003366]">Compre no Zap</h3>
                    <p className="text-xs text-slate-500">Atendimento humano</p>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                    <div className="bg-purple-100 p-3 rounded-full mb-2 text-purple-700">
                        <CreditCard size={32} />
                    </div>
                    <h3 className="font-bold text-[#003366]">Preço de Atacado</h3>
                    <p className="text-xs text-slate-500">Pague na entrega</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- OFERTAS DESTAQUE --- */}
      {highlightedOffers.length > 0 && !loading && (
        <section className="bg-gradient-to-b from-red-50 to-[#F3F4F6] py-10 border-b border-red-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-full animate-bounce">
                  <Flame size={32} className="text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-red-700 uppercase tracking-tight italic transform -skew-x-12">
                    Ofertas Relâmpago
                  </h2>
                  <p className="text-red-500 font-bold text-sm">O patrão ficou maluco! Aproveite antes que acabe.</p>
                </div>
              </div>
              <button 
                onClick={handleViewAllOffers}
                className="text-red-600 font-bold hover:bg-red-100 px-4 py-2 rounded-lg transition flex items-center gap-2 group"
              >
                Ver Todas as Ofertas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {highlightedOffers.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  onBuyNow={handleBuyClick}
                  large={true} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CATÁLOGO --- */}
      <main id="produtos" className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-200 pb-2">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#003366] flex items-center gap-2">
                    <Grid size={24} className="text-yellow-500"/>
                    {activeCategory === 'ofertas' ? 'Todas as Ofertas' : 'Catálogo Completo'}
                    {subCategoryFilter && <span className="text-sm font-normal text-slate-500 ml-2">/ Buscando por "{subCategoryFilter}"</span>}
                </h2>
            </div>
            <div className="text-sm text-slate-500">
                {filteredProducts.length} itens disponíveis
            </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded shadow-sm">
             <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
             <p className="text-slate-500 font-medium">Carregando catálogo...</p>
           </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  onBuyNow={handleBuyClick} 
                />
              ))}
           </div>
        )}

        {!loading && filteredProducts.length === 0 && (
            <div className="bg-white p-8 rounded text-center border border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-2"/>
                <p className="text-slate-600">Nenhum produto encontrado com esse nome.</p>
                <button onClick={() => {setSearchTerm(''); setActiveCategory('todos')}} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Limpar filtros</button>
            </div>
        )}
      </main>

      {/* --- SIDEBAR CARRINHO --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-[#003366] text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                <h2 className="text-xl font-bold">Seu Pedido</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <ShoppingCart size={48} className="mb-2 opacity-50" />
                  <p className="text-lg font-medium">Sua sacola está vazia</p>
                  <p className="text-sm">Adicione itens para fazer seu pedido</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-blue-600 font-bold hover:underline">
                    Voltar para a loja
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-3">
                    <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-16 h-16 object-contain bg-slate-100 rounded" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">Cód: {item.id}</p>
                      <div className="flex justify-between items-end">
                        <div className="text-blue-900 font-bold">
                           {item.consult ? "A consultar" : `R$ ${(item.price * item.quantity).toFixed(2)}`}
                        </div>
                        
                        <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                          <button 
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)} 
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                          >
                             {item.quantity === 1 ? <Trash2 size={14} className="text-red-500"/> : <Minus size={14}/>}
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-slate-200 text-slate-600 transition">
                            <Plus size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-slate-500 font-medium">Total Estimado</span>
                 <span className="text-2xl font-black text-[#003366]">R$ {cartTotal.toFixed(2)}</span>
               </div>
               
               <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95"
               >
                 <img src={WHATSAPP_ICON_URL} className="w-6 h-6 object-contain filter brightness-0 invert" alt="Zap" />
                 ENVIAR PEDIDO NO ZAP
               </button>
               <p className="text-[10px] text-center text-slate-400 mt-2">
                 O pagamento é combinado diretamente no WhatsApp.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#002855] text-slate-300 pt-10 pb-24 md:pb-8 text-sm border-t-4 border-yellow-500">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span
                      className="logo-wrap bg-white overflow-hidden"
                      style={buildLogoVars(LOGO_SETTINGS.footer)}
                    >
                      <img
                        src={`${ASSET_BASE}logo-pratika.png`}
                        className="logo-img"
                        style={buildLogoImgStyle(LOGO_SETTINGS.footer)}
                        alt="Logo"
                      />
                    </span>
                    Prátika
                </h4>
                <p className="mb-4 text-xs leading-relaxed">
                    Sua ferragista online. Pedidos via WhatsApp com entrega expressa para toda Goiânia e região.
                </p>
                <div className="flex gap-2">
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full transition">
                    <MessageCircle size={20} />
                  </a>
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Atendimento</h4>
                <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex items-center gap-2 hover:text-green-400">
                        <Phone size={14} className="text-yellow-400"/> (62) 98205-5254
                      </a>
                    </li>
                    <li className="flex items-center gap-2 justify-center md:justify-start"><MapPin size={14} className="text-yellow-400"/> Goiânia - GO</li>
                    <li className="flex items-center gap-2 justify-center md:justify-start"><Clock size={14} className="text-green-400"/> Entregas: Seg à Sex</li>
                </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Dúvidas</h4>
                <ul className="space-y-2 text-xs">
                    <li><a href="#" className="hover:text-yellow-400">Como Comprar</a></li>
                    <li><a href="#" className="hover:text-yellow-400">Taxas de Entrega</a></li>
                    <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="hover:text-yellow-400">Fale Conosco</a></li>
                </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Pagamento na Entrega</h4>
                <div className="flex gap-4 items-center flex-wrap justify-center md:justify-start">
                    <div className="flex flex-col items-center text-white/80 hover:text-white transition">
                        <img src={`${ASSET_BASE}pix-icon.png`} className="h-8 w-8 object-contain" alt="Pix" />
                        <span className="text-[10px] font-bold mt-1">Pix</span>
                    </div>
                    <div className="flex flex-col items-center text-white/80 hover:text-white transition">
                        <CreditCard size={24} />
                        <span className="text-[10px] font-bold mt-1">Cartão</span>
                    </div>
                    <div className="flex flex-col items-center text-white/80 hover:text-white transition">
                        <Banknote size={24} />
                        <span className="text-[10px] font-bold mt-1">Dinheiro</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center mt-8 pt-6 border-t border-white/10 text-[11px] text-slate-500">
            &copy; 2026 Prátika Ferragista Online. Todos os direitos reservados.
        </div>
      </footer>

      {/* --- FAB CORRIGIDO PARA ÍCONE COLORIDO --- */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-white border-2 border-green-500 text-green-600 p-3 md:p-4 rounded-full shadow-2xl transition hover:scale-110 flex items-center gap-2 group animate-bounce-slow hover:bg-green-50"
      >
        <img src={WHATSAPP_ICON_URL} className="w-6 h-6 md:w-8 md:h-8 object-contain" alt="Zap"/>
        <span className="hidden group-hover:block font-bold pr-2 text-sm md:text-base">FAZER PEDIDO AGORA</span>
      </a>

    </div>
  );
};

export default App;
