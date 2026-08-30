import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Camera, Printer, PackageOpen, 
  Palette, Star, Sparkles, MessageCircleHeart,
  X, ChevronsLeftRight, Heart
} from 'lucide-react';

// === ОПТИМІЗОВАНІ АНІМАЦІЇ ДЛЯ ПЛАВНОСТІ ===
const springConfig = { type: "spring", stiffness: 80, damping: 15, mass: 0.8 };
const bounceConfig = { type: "spring", stiffness: 120, damping: 12, bounce: 0.4 };

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springConfig }
};

const fadeRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: springConfig }
};

const fadeLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: springConfig }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scrollConfig = { once: true, amount: 0.1 }; 

// Оновлена галерея на 8 фото у форматі .webp
const galleryData = [
  { text: "Принцеси", orig: "/1.webp", draw: "/11.webp" },
  { text: "Казки", orig: "/2.webp", draw: "/22.webp" },
  { text: "Лісова Магія", orig: "/3.webp", draw: "/33.webp" },
  { text: "Космос", orig: "/4.webp", draw: "/44.webp" },
  { text: "Професії", orig: "/5.webp", draw: "/55.webp" },
  { text: "Супергерої", orig: "/6.webp", draw: "/66.webp" },
  { text: "Фентезі", orig: "/7.webp", draw: "/77.webp" },
  { text: "Транспорт", orig: "/8.webp", draw: "/88.webp" }
];

// === АВТОМАТИЧНА 3D КАРУСЕЛЬ ГОЛОВНОГО ЕКРАНУ ===
const HeroCarousel = () => {
  const images = ['/image.png', '/1image.png', '/2image.png'];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-[800px] h-[450px] md:h-[650px] mx-auto flex items-center justify-center" style={{ perspective: '1200px' }}>
      
      <motion.div 
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.95, 1.05, 0.95] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-[#FF1493] to-[#FF5F15] rounded-full blur-[70px] z-0 pointer-events-none will-change-transform"
      />

      {images.map((img, index) => {
        let offset = index - activeIndex;
        if (offset === -2) offset = 1;
        if (offset === 2) offset = -1;

        const isCenter = offset === 0;
        const xOffset = window.innerWidth < 768 ? 85 : 180;

        return (
          <motion.div
            key={img}
            initial={false}
            animate={{
              x: offset * xOffset,
              scale: isCenter ? 1 : 0.85,
              zIndex: isCenter ? 30 : 10,
              opacity: isCenter ? 1 : 0.6,
              rotateY: offset * -20,
              y: isCenter ? 0 : 25 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
          >
            <img
              src={img}
              alt="Журнал"
              className="w-[280px] md:w-[450px] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] relative z-10"
            />
            
            <div 
              className="absolute -bottom-6 md:-bottom-10 w-[220px] md:w-[360px] h-[15px] md:h-[20px] bg-slate-900/50 rounded-[100%] blur-[12px] z-0"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// --- ПОВНОЕКРАННИЙ СЛАЙДЕР ДО/ПІСЛЯ ---
const CompareModal = ({ isOpen, onClose, data }) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPosition(50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const updatePosition = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - left, width));
    setPosition((x / width) * 100);
  };

  const handleStart = (e) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md touch-none"
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchEnd={handleEnd}
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 shadow-lg"
          >
            <X size={32} />
          </button>
          
          <div className="text-center absolute top-12 w-full pointer-events-none z-50">
            <p className="text-[#FF1493] font-black text-lg mt-2 uppercase tracking-widest drop-shadow-md">Тягни лінію вліво/вправо</p>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={springConfig}
            ref={containerRef}
            className="relative w-full max-w-2xl aspect-[3/4] md:aspect-square rounded-3xl overflow-hidden cursor-ew-resize select-none bg-slate-900 border-2 border-white/20 shadow-2xl mt-10"
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
          >
            <img src={data.draw} decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="Розмальовка" />
            
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-white/80 shadow-[2px_0_10px_rgba(0,0,0,0.5)]"
              style={{ width: `${position}%` }}
            >
              <img src={data.orig} decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ width: '100vw', maxWidth: containerRef.current?.offsetWidth || '100%' }} alt="Оригінал" />
            </div>
            
            <div 
              className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none" 
              style={{ left: `${position}%` }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)] text-[#FF1493] -ml-6 border-4 border-white/50">
                <ChevronsLeftRight size={28} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// === БЕЗКІНЕЧНА 3D КАРУСЕЛЬ ДЛЯ МОБІЛЬНИХ ===
const InfiniteMobileCarousel = ({ items, onClick }) => {
  const [active, setActive] = useState(0);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) setActive(a => a + 1);
    else if (info.offset.x > 40) setActive(a => a - 1);
  };

  const renderItems = [];
  for (let i = -2; i <= 2; i++) {
    const index = active + i;
    const dataIndex = ((index % items.length) + items.length) % items.length;
    const item = items[dataIndex];
    
    const offset = i; 
    const x = offset * 65; 
    const rotate = offset * 6;
    const scale = 1 - Math.abs(offset) * 0.15;
    const zIndex = 30 - Math.abs(offset);
    const opacity = 1 - Math.abs(offset) * 0.4;

    renderItems.push(
      <motion.div
        key={index}
        animate={{ x, rotate, scale, zIndex, opacity }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (offset === 0) onClick(item);
          else setActive(active + offset);
        }}
        className={`absolute w-[65vw] max-w-[280px] aspect-[3/4] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] overflow-hidden border-[6px] border-white cursor-grab active:cursor-grabbing bg-slate-100 flex items-center justify-center`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-0 pointer-events-none">
          <Camera size={32} />
        </div>
        <img src={item.orig} decoding="async" className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" alt={item.text} />
      </motion.div>
    );
  }

  return (
    <div className="relative h-[420px] w-full flex justify-center items-center overflow-hidden touch-pan-y">
      {renderItems}
    </div>
  );
};

// === ЕЛЕМЕНТ СІТКИ ДЛЯ ПК ===
const GalleryItemPC = ({ role, idx, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div 
      variants={fadeUp} 
      whileHover={{ 
        scale: 1.05, 
        y: -10, 
        rotate: [0, -3, 3, -3, 2, 0],
        transition: { duration: 0.5 }
      }} 
      className="glass-frame p-2 aspect-[3/4] flex flex-col cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(255,20,147,0.3)] relative overflow-hidden group border-white/80 w-full max-w-[300px] mx-auto transition-shadow"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={() => onClick(role)}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden bg-slate-100 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-0 pointer-events-none">
          <Camera size={32} />
        </div>

        <img src={role.draw} decoding="async" className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" alt="Розмальовка" />
        
        <motion.div 
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={{ clipPath: isActive ? "inset(0 100% 0 0)" : "inset(0 0 0 0)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }} 
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <img src={role.orig} decoding="async" className="w-full h-full object-cover pointer-events-none" alt="Оригінал" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [selectedPages, setSelectedPages] = useState(14);
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const { scrollYProgress } = useScroll();
  const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const prices = {
    9: { old: 500, new: 400, label: 'Lite' },
    14: { old: 620, new: 550, label: 'PRO' },
    23: { old: 1010, new: 700, label: 'Maximum' }
  };

  const scrollToOrder = () => {
    document.getElementById('order-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen flex flex-col text-slate-800 font-sans overflow-x-hidden selection:bg-brand-pink selection:text-white relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      
      <motion.div style={{ y: yBg1, willChange: "transform" }} className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-[#FF1493]/10 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />
      <motion.div style={{ y: yBg2, willChange: "transform" }} className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-gradient-to-bl from-[#FF5F15]/10 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />

      <CompareModal isOpen={!!selectedImageModal} onClose={() => setSelectedImageModal(null)} data={selectedImageModal} />

      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={bounceConfig}
        className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-white/40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="text-[#FF5F15]">✏️ Моя</span> Розмальовка
          </div>
          <div className="hidden md:flex gap-8 font-bold text-sm text-slate-700">
            <a href="#gallery" className="hover:text-[#FF1493] transition-all">Галерея</a>
            <a href="#about" className="hover:text-[#FF1493] transition-all">Для кого</a>
            <a href="#how-it-works" className="hover:text-[#FF1493] transition-all">Як працює</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: [-2, 2, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToOrder}
            className="bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white px-6 py-2.5 rounded-full font-black shadow-lg shadow-[#FF1493]/30 text-sm tracking-wide"
          >
            Замовити
          </motion.button>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16 lg:pt-40 relative z-10 shrink-0" id="order-section">
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp}
          style={{ y: yHero, willChange: "transform" }}
          className="text-center max-w-4xl mx-auto mb-6 md:mb-16"
        >
          <motion.div 
            whileHover={{ rotate: [0, -3, 3, -3, 0] }}
            className="inline-block bg-white/95 backdrop-blur-md px-5 py-2 rounded-full font-black text-[#FF1493] text-sm mb-6 border border-[#FF1493]/20 shadow-[0_5px_15px_rgba(255,20,147,0.15)] cursor-default"
          >
            ✨ Емоції, які залишаються назавжди
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight drop-shadow-sm">
            УНІКАЛЬНІ СТИЛЬНІ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1493] to-[#FF5F15]">
              РОЗМАЛЬОВКИ
            </span> <br />
            З ВЛАСНИХ ФОТО
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-semibold leading-relaxed">
            Ми можемо <b className="text-slate-800">створити</b> розмальовку ідентично по вашому фото або ж перенести головного героя у світ фантазій. Будь-яка тематика за вашим бажанням!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center max-w-6xl mx-auto">
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeRight}
            className="relative w-full max-w-[550px] mx-auto"
          >
            <HeroCarousel />
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeLeft}
            className="glass-card rounded-[2.5rem] p-6 md:p-10 w-full relative overflow-hidden shadow-2xl bg-white/80 border-white/60 mx-auto max-w-lg lg:max-w-xl"
          >
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">СТВОРИ ЗАРАЗ</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Оберіть об'єм</p>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
              {[9, 14, 23].map((num) => (
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  key={num}
                  onClick={() => setSelectedPages(num)}
                  className={`w-full flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-colors duration-300 relative ${
                    selectedPages === num 
                      ? 'border-[#FF5F15] bg-white shadow-xl scale-[1.02]' 
                      : 'border-white/80 hover:border-[#FF5F15]/50 bg-white/60 hover:bg-white'
                  }`}
                >
                  {selectedPages === num && (
                    <motion.div layoutId="badge" className="absolute -top-3 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[11px] uppercase font-black px-3 py-1 rounded-full shadow-lg">
                      {prices[num].label}
                    </motion.div>
                  )}
                  <span className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-700">
                    <Palette size={24} className={selectedPages === num ? "text-[#FF5F15]" : "text-slate-400"} />
                    {num} арк.
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 line-through block mb-[-2px]">{prices[num].old} ₴</span>
                    <span className="text-xl md:text-2xl font-black text-slate-900">{prices[num].new} <span className="text-base">₴</span></span>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.03, rotate: [-1, 1, -1, 0], boxShadow: "0 15px 30px -5px rgba(255, 95, 21, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white text-base md:text-lg font-black py-4 md:py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 relative z-10 tracking-wide whitespace-nowrap px-4"
            >
              ЗАМОВИТИ РОЗМАЛЬОВКУ
              <ChevronRight size={26} className="shrink-0" />
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* ГАЛЕРЕЯ */}
      <section id="gallery" className="py-16 relative overflow-hidden shrink-0 z-10">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center mb-8 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-4">ІДЕЇ ДЛЯ <span className="text-[#FF1493]">НАТХНЕННЯ!</span></h2>
            <p className="text-base md:text-lg text-slate-700 font-semibold max-w-4xl mx-auto leading-relaxed">
              Ми можемо <b className="text-slate-900">створити розмальовку ідентично по вашому оригінальному фото</b>, дбайливо зберігши кожну деталь, або ж перенести головного героя у захопливий <b className="text-[#FF1493]">світ фантазій</b> (космос, казки, улюблені професії). Усі ідеї та побажання детально обговорюються перед початком роботи!
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp}
            className="flex justify-center w-full mb-8 px-4"
          >
            <motion.div 
              animate={{ scale: [1, 1.03, 1], boxShadow: ["0 5px 15px rgba(255,20,147,0.1)", "0 15px 25px rgba(255,20,147,0.25)", "0 5px 15px rgba(255,20,147,0.1)"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="bg-white/95 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full border-2 border-[#FF1493]/20 flex items-center justify-center gap-2 cursor-default whitespace-nowrap"
            >
              <Sparkles className="text-[#FF5F15] shrink-0 w-4 h-4 md:w-5 md:h-5" /> 
              <span className="text-[#FF1493] font-black tracking-widest uppercase text-[10px] md:text-sm whitespace-nowrap">
                Натисни на фото, щоб побачити магію
              </span>
              <span className="text-sm md:text-xl drop-shadow-md shrink-0">👇</span>
            </motion.div>
          </motion.div>

          {/* Мобільна безкінечна 3D Карусель */}
          <div className="block md:hidden mb-10">
            <InfiniteMobileCarousel items={galleryData} onClick={setSelectedImageModal} />
          </div>

          {/* ПК Сітка (Тепер 2 ряди по 4 фото) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger}
            className="hidden md:grid md:grid-cols-4 gap-8 max-w-[85rem] mx-auto pb-10 px-4"
          >
            {galleryData.map((role, idx) => (
              <GalleryItemPC key={idx} role={role} idx={idx} onClick={setSelectedImageModal} />
            ))}
          </motion.div>

        </div>
      </section>

      {/* БЛОК: СІМЕЙНІ ТА ДЛЯ ДОРОСЛИХ */}
      <section id="about" className="py-12 relative z-10 shrink-0">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp}
          className="max-w-5xl mx-auto px-4"
        >
          <div className="glass-card bg-gradient-to-r from-white/95 to-white/80 rounded-[2rem] p-8 md:p-12 text-center shadow-xl border-white/80 relative overflow-hidden hover:shadow-2xl transition-shadow duration-500">
            <Heart className="absolute -top-10 -left-10 text-[#FF1493]/10" size={150} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-black mb-4 text-slate-800">НЕ ЛИШЕ ДЛЯ ДІТЕЙ 👨‍👩‍👧‍👦</h2>
              <p className="text-base md:text-lg text-slate-600 font-semibold max-w-3xl mx-auto leading-relaxed">
                Шукаєте оригінальний подарунок? Ми створюємо неймовірні <b className="text-[#FF1493]">сімейні портрети, love-story та подарунки для дорослих</b>. Будь-яке ваше фото перетвориться на захоплюючу розмальовку, яка об'єднає всю родину!
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ЯК ЦЕ ПРАЦЮЄ */}
      <section id="how-it-works" className="py-20 bg-white/50 backdrop-blur-md border-y border-white/50 shrink-0 relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-3xl md:text-5xl font-black text-center mb-16">
            ЯК МИ СТВОРЮЄМО <span className="text-[#FF5F15]">МАГІЮ</span>
          </motion.h2>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { icon: <Camera />, title: "1. Завантажте фото", desc: "Оберіть одне або кілька улюблених фотографій." },
              { icon: <MessageCircleHeart />, title: "2. Узгодження теми", desc: "Ми зв'яжемося з вами, щоб обрати бажаний стиль." },
              { icon: <Printer />, title: "3. Ми друкуємо", desc: "Наші майстри створюють контури та друкують." },
              { icon: <PackageOpen />, title: "4. Отримайте", desc: "Надійно пакуємо та швидко відправляємо поштою." }
            ].map((step, idx) => (
              <motion.div 
                key={idx} variants={fadeUp} 
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-card h-full rounded-2xl md:rounded-[2rem] p-4 md:p-8 text-center shadow-lg hover:shadow-2xl bg-white/90 transition-all duration-300 border-white/80 flex flex-col items-center justify-start"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#FF1493] to-[#FF5F15] rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-md shrink-0"
                >
                  {React.cloneElement(step.icon, { className: "w-7 h-7 md:w-10 md:h-10" })}
                </motion.div>
                
                <div className="flex flex-col flex-1 w-full">
                  <div className="min-h-[48px] md:min-h-[64px] flex items-center justify-center mb-2">
                    <h3 className="text-base md:text-xl font-black text-slate-800 leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed mt-auto">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ВІДГУКИ */}
      <section id="reviews" className="py-20 shrink-0">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-3xl md:text-5xl font-black mb-12">
            ЩАСЛИВІ КЛІЄНТИ
          </motion.h2>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { name: "Олена М.", text: "Якість паперу супер, пружина міцна. Вся родина в захваті!" },
              { name: "Вікторія К.", text: "Зробили ідентично по нашому фото, вийшов крутий подарунок чоловіку." },
              { name: "Ірина С.", text: "Найкращий подарунок. Взяли максимальну на 23 аркуші, малюємо разом." }
            ].map((review, idx) => (
              <motion.div 
                key={idx} variants={fadeUp} 
                whileHover={{ scale: 1.03, y: -5, rotate: idx % 2 === 0 ? 1 : -1 }}
                className="glass-card rounded-[2rem] p-6 md:p-8 text-left bg-white/80 shadow-xl border-white/60"
              >
                <div className="flex text-[#FF5F15] mb-4 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 italic mb-4 font-semibold text-sm md:text-base leading-relaxed">"{review.text}"</p>
                <p className="font-black text-lg text-slate-900">{review.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ПІДВАЛ */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-white/60 py-6 md:py-8 mt-auto shrink-0 w-full relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          <div className="font-black text-xl flex items-center gap-2">
            <span className="text-[#FF5F15]">✏️ Моя </span> Розмальовка
          </div>
          <p className="text-slate-500 font-bold text-xs">© 2026 Всі права захищено.</p>
        </div>
      </footer>
      
    </div>
  );
}