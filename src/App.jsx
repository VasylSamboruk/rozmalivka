import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ChevronRight, Camera, Printer, PackageOpen, 
  Palette, Star, Sparkles, MessageCircleHeart,
  X, ChevronsLeftRight, Heart, CheckCircle2, ChevronDown,
  Send, Phone, ShieldCheck, MessageSquarePlus
} from 'lucide-react';

// === НАЛАШТУВАННЯ TELEGRAM БОТА ===
const TELEGRAM_BOT_TOKEN = '8973709125:AAFC2nc51oMaIZVk78z8hWizozBcSmS52lI';
const TELEGRAM_CHAT_ID = '8844188635';

// --- НОВА ФУНКЦІЯ ДЛЯ ВІДПРАВКИ КЛІКІВ ТА IP ---
const sendClickToTelegram = async (buttonName) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;

    const message = `🖱 <b>Клік по кнопці!</b>\n\n🔘 <b>Кнопка:</b> ${buttonName}\n🌐 <b>IP адреса:</b> ${userIP}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error("Помилка відправки кліку в Телеграм:", error);
  }
};

// Функція точного запуску конфеті прямо з натиснутої кнопки поверх усіх вікон
// Точний салют із точки кліку (пальця/мишки) на кнопці
const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    zIndex: 9999,
    colors: ['#FF1493', '#FF5F15', '#FFD700', '#00C9FF', '#92FE9D']
  });
};

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

const faqs = [
  { q: "Що робити, якщо фото не дуже якісне?", a: "Наші дизайнери можуть значно покращити якість більшості фото під час обробки. Якщо ж фото зовсім не підходить для якісного результату, ми обов'язково повідомимо вас і попросимо інший варіант перед початком роботи." },
  { q: "Скільки правок/узгоджень включено в ціну?", a: "Ми завжди погоджуємо з вами ескізи перед тим, як відправити їх до друку. У вартість включено до 3-х безкоштовних правок, щоб ви були на 100% задоволені результатом." },
  { q: "Чи можна кілька людей/персонажів в одній розмальовці?", a: "Так, звичайно! Ми можемо об'єднати людей з різних фотографій в один спільний гармонійний сюжет без жодних доплат." },
  { q: "Які терміни виготовлення та доставки?", a: "Виготовлення займає від 1 до 3 днів! Після цього ми відправляємо замовлення Новою Поштою (доставка зазвичай займає 1-2 дні)." },
  { q: "Як відбувається оплата?", a: "Ми працюємо по повній передоплаті. Оскільки кожна розмальовка — це унікальний товар, який малюється та друкується індивідуально під ваше замовлення, ми беремо повну оплату перед запуском у виробництво." },
  { q: "Чи можна замовити для дорослого/у подарунок?", a: "Абсолютно! Це один із найпопулярніших форматів. Розмальовки-антистрес, сімейні сюжети або love-story — чудовий та оригінальний подарунок для дорослих." },
  { q: "Що робити, якщо результат не сподобався?", a: "Оскільки ми погоджуємо кожен макет перед друком, сюрпризів не буде. Якщо ж на етапі ескізу вам зовсім не сподобається напрямок, ми обов'язково переробимо його." }
];

const HeroCarousel = () => {
  const images = ['/image.webp', '/1image.webp', '/2image.webp', '/3image.webp'];
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
        const len = images.length;
        if (offset > len / 2) offset -= len;
        if (offset < -len / 2) offset += len;

        const isCenter = offset === 0;
        
        let xPos = 0;
        let yPos = 0;
        let scaleVal = 1;
        let zIdx = 10;
        let opacityVal = 1;

        const xDist = window.innerWidth < 768 ? 70 : 130;

        if (isCenter) {
          xPos = 0;
          yPos = 35; 
          scaleVal = 1;
          zIdx = 30;
          opacityVal = 1;
        } else if (offset === 1) {
          xPos = xDist;
          yPos = 0;
          scaleVal = 0.85;
          zIdx = 20;
          opacityVal = 0.85;
        } else if (offset === -1) {
          xPos = -xDist;
          yPos = 0;
          scaleVal = 0.85;
          zIdx = 20;
          opacityVal = 0.85;
        } else {
          xPos = 0;
          yPos = -30;
          scaleVal = 0.7;
          zIdx = 5;
          opacityVal = 0.5;
        }

        return (
          <motion.div
            key={img}
            initial={false}
            animate={{
              x: xPos,
              y: yPos,
              scale: scaleVal,
              zIndex: zIdx,
              opacity: opacityVal,
              rotateY: offset * -10
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
          >
            <img
              src={img}
              alt="Журнал"
              width={450}
              height={480}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="w-[230px] md:w-[360px] h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] relative z-10"
            />
            <div className="absolute -bottom-6 md:-bottom-10 w-[170px] md:w-[280px] h-[15px] md:h-[20px] bg-slate-900/40 rounded-[100%] blur-[12px] z-0" />
          </motion.div>
        );
      })}
    </div>
  );
};

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

  const handleStart = (e) => { setIsDragging(true); updatePosition(e); };
  const handleMove = (e) => { if (!isDragging) return; updatePosition(e); };
  const handleEnd = () => setIsDragging(false);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md touch-none"
          onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchEnd={handleEnd}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 shadow-lg">
            <X size={32} />
          </button>
          
          <div className="text-center absolute top-12 w-full pointer-events-none z-50">
            <p className="text-[#FF1493] font-black text-lg mt-2 uppercase tracking-widest drop-shadow-md">Тягни лінію вліво/вправо</p>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={springConfig}
            ref={containerRef}
            className="relative w-full max-w-2xl aspect-[3/4] md:aspect-square rounded-3xl overflow-hidden cursor-ew-resize select-none bg-slate-900 border-2 border-white/20 shadow-2xl mt-10"
            onMouseDown={handleStart} onTouchStart={handleStart} onMouseMove={handleMove} onTouchMove={handleMove}
          >
            <img src={data.draw} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="Розмальовка" />
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-white/80 shadow-[2px_0_10px_rgba(0,0,0,0.5)]" style={{ width: `${position}%` }}>
              <img src={data.orig} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ width: '100vw', maxWidth: containerRef.current?.offsetWidth || '100%' }} alt="Оригінал" />
            </div>
            
            <div className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none" style={{ left: `${position}%` }}>
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
        key={index} animate={{ x, rotate, scale, zIndex, opacity }} transition={{ type: "spring", stiffness: 260, damping: 25 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd}
        onClick={() => { if (offset === 0) onClick(item); else setActive(active + offset); }}
        className="absolute w-[65vw] max-w-[280px] aspect-[3/4] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] overflow-hidden border-[6px] border-white cursor-grab active:cursor-grabbing bg-slate-100 flex items-center justify-center"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-0 pointer-events-none">
          <Camera size={32} />
        </div>
        <img src={item.orig} loading="lazy" decoding="async" width={280} height={373} className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" alt={item.text} />
      </motion.div>
    );
  }

  return (
    <div className="relative h-[420px] w-full flex justify-center items-center overflow-hidden touch-pan-y">
      {renderItems}
    </div>
  );
};

const GalleryItemPC = ({ role, idx, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div 
      variants={fadeUp} whileHover={{ scale: 1.05, y: -10, rotate: [0, -3, 3, -3, 2, 0], transition: { duration: 0.5 } }} 
      className="glass-frame p-2 aspect-[3/4] flex flex-col cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(255,20,147,0.3)] relative overflow-hidden group border-white/80 w-full max-w-[300px] mx-auto transition-shadow"
      onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)} onClick={() => onClick(role)}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden bg-slate-100 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-0 pointer-events-none">
          <Camera size={32} />
        </div>
        <img src={role.draw} loading="lazy" decoding="async" width={300} height={400} className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" alt="Розмальовка" />
        <motion.div 
          initial={{ clipPath: "inset(0 0 0 0)" }} animate={{ clipPath: isActive ? "inset(0 100% 0 0)" : "inset(0 0 0 0)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }} className="absolute inset-0 z-20 pointer-events-none"
        >
          <img src={role.orig} loading="lazy" decoding="async" width={300} height={400} className="w-full h-full object-cover pointer-events-none" alt="Оригінал" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <motion.div 
      variants={fadeUp}
      className={`border-2 transition-colors duration-300 rounded-2xl overflow-hidden cursor-pointer ${isOpen ? 'border-[#FF5F15] bg-white shadow-md' : 'border-white bg-white hover:bg-slate-50'}`}
      onClick={onClick}
    >
      <div className="p-5 flex justify-between items-center gap-4">
        <h3 className="font-black text-slate-800 text-sm md:text-base leading-snug">{faq.q}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-[#FF1493] shrink-0">
          <ChevronDown size={24} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-5 pt-0 text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-1">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// === МОДАЛЬНЕ ВІКНО "ЗАМОВИТИ" ===
const OrderModal = ({ isOpen, onClose }) => {
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSuccess(false);
      setContact('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const trackContactClick = (channel, e) => {
    fireConfetti(e);
    
    // Новий рядок для відправки в Телеграм
    sendClickToTelegram(channel);
    
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: channel,
        currency: 'UAH'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    fireConfetti(e);
    setIsSubmitting(true);
    const message = `📞 <b>Нова заявка на дзвінок/зв'язок!</b>\n\n👤 <b>Контакт (номер або нік):</b> ${contact}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Помилка відправки:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={springConfig}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#ECEEF1] rounded-[2rem] p-6 md:p-8 w-full max-w-[400px] relative shadow-2xl flex flex-col items-center text-center border-2 border-white"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 bg-[#FF1493]/10 text-[#FF1493] rounded-full flex items-center justify-center mb-5 shadow-inner">
              <MessageCircleHeart size={40} />
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2">Оформлення<br/>замовлення</h3>
            <p className="text-slate-600 font-medium mb-6 text-sm leading-relaxed">
              Ви можете оформити замовлення безпосередньо в месенджерах. Натисніть кнопку нижче, щоб перейти до нашого менеджера:
            </p>

            <div className="w-full flex flex-col gap-3 mb-6">
              <a
                href="https://instagram.com/my_rozm" 
                target="_blank"
                rel="noreferrer"
                onClick={(e) => trackContactClick('Instagram', e)}
                className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#fd1d1d]/30 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>

              <a
                href="https://t.me/my_rozm" 
                target="_blank"
                rel="noreferrer"
                onClick={(e) => trackContactClick('Telegram', e)}
                className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0088cc]/30 hover:scale-[1.02]"
              >
                <Send size={20} /> Telegram
              </a>

              <a
                href="viber://chat?number=%2B380931355348" 
                target="_blank"
                rel="noreferrer"
                onClick={(e) => trackContactClick('Viber', e)}
                className="w-full bg-[#7360F2] hover:bg-[#5d4be6] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7360F2]/30 hover:scale-[1.02]"
              >
                <Phone size={20} /> Viber
              </a>
            </div>

            {/* БЛОК ЗВ'ЯЗКУ */}
            <div className="w-full relative mt-2 pt-6 border-t border-slate-200">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ECEEF1] px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Або
              </div>
              <p className="text-slate-600 font-medium mb-3 text-xs md:text-sm">
                Залиште свій номер або нікнейм, і ми зв'яжемося з вами:
              </p>
              
              {success ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 text-green-600 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-green-200">
                  <CheckCircle2 size={18} /> Заявку прийнято!
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+380... або @telegram"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-800 font-medium py-3 px-4 rounded-xl outline-none focus:border-[#FF5F15] focus:ring-2 focus:ring-[#FF5F15]/20 transition-all shadow-sm text-sm"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white px-5 rounded-xl shadow-md flex items-center justify-center shrink-0 disabled:opacity-70"
                  >
                    {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={18} />}
                  </motion.button>
                </form>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// === МОДАЛЬНЕ ВІКНО ДЛЯ ВІДГУКІВ ===
const ReviewModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSuccess(false);
      setName('');
      setReview('');
      setRating(5);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;

    fireConfetti(e);
    setIsSubmitting(true);
    const message = `✨ <b>Новий відгук!</b>\n\n👤 <b>Ім'я:</b> ${name}\n⭐️ <b>Оцінка:</b> ${rating}/5\n💬 <b>Відгук:</b> ${review}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (error) {
      console.error("Помилка відправки:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={springConfig}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#ECEEF1] rounded-[2rem] p-6 md:p-8 w-full max-w-[400px] relative shadow-2xl flex flex-col items-center text-center border-2 border-white"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>

            {success ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Дякуємо!</h3>
                <p className="text-slate-600 font-medium text-sm">Ваш відгук успішно відправлено.</p>
              </motion.div>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#FF5F15]/10 text-[#FF5F15] rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <MessageSquarePlus size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Залишити відгук</h3>
                <p className="text-slate-600 font-medium mb-6 text-sm leading-relaxed">Поділіться своїми враженнями від нашої розмальовки!</p>
                
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  <div className="flex justify-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className={`transition-colors duration-300 ${rating >= star ? 'text-[#FF5F15]' : 'text-slate-300 hover:text-slate-400'}`}>
                        <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" required className="w-full bg-white border border-slate-200 text-slate-800 font-medium py-3.5 px-4 rounded-xl outline-none focus:border-[#FF5F15] focus:ring-2 focus:ring-[#FF5F15]/20 transition-all shadow-sm" />
                  </div>
                  
                  <div className="relative">
                    <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Напишіть ваш відгук тут..." rows={3} required className="w-full bg-white border border-slate-200 text-slate-800 font-medium py-3 px-4 rounded-xl outline-none focus:border-[#FF5F15] focus:ring-2 focus:ring-[#FF5F15]/20 transition-all shadow-sm resize-none" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full mt-2 bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white font-black py-4 rounded-xl shadow-lg shadow-[#FF1493]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                    {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Відправити відгук <Send size={18} /></>}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [selectedPages, setSelectedPages] = useState(14);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prices = {
    9: { old: 500, new: 400, label: 'Lite' },
    14: { old: 620, new: 550, label: 'PRO' },
    23: { old: 1010, new: 700, label: 'Maximum' }
  };

  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.99, 0.35]); 
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);       

  return (
    <div className="min-h-screen flex flex-col text-slate-800 font-sans overflow-x-hidden selection:bg-brand-pink selection:text-white relative bg-[#ECEEF1]" onContextMenu={(e) => e.preventDefault()}>
      
      {/* Адаптивний фон з затемненням як на фото 2 */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ opacity: bgOpacity, scale: bgScale, willChange: "transform, opacity" }}
          className="w-full h-full relative"
        >
          <img 
            src="/fonik2.webp" 
            alt="Фон" 
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover block md:hidden"
          />
          <img 
            src="/fonik.webp" 
            alt="Фон ПК" 
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover hidden md:block"
          />
          {/* Шар затемнення для ефекту фото 2 */}
          <div className="absolute inset-0 bg-slate-900/10 backdrop-contrast-[1.05]" />
        </motion.div>
      </div>

      <CompareModal isOpen={!!selectedImageModal} onClose={() => setSelectedImageModal(null)} data={selectedImageModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />

      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={bounceConfig} className="fixed top-0 w-full z-50 pointer-events-none">
        <motion.div initial={false} animate={{ y: isScrolled ? -100 : 0, opacity: isScrolled ? 0 : 1 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="absolute inset-0 bg-white/80 backdrop-blur-lg border-b border-white/40 shadow-sm pointer-events-auto" />
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative z-10">
          <motion.div initial={false} animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? -20 : 0 }} transition={{ duration: 0.3 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex items-center gap-2 text-lg md:text-xl font-black tracking-tight cursor-pointer ${isScrolled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            <span className="text-[#e6500e]">✏️ Моя</span> Розмальовка
          </motion.div>
          <motion.div initial={false} animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? -20 : 0 }} transition={{ duration: 0.3 }} className={`hidden md:flex gap-8 font-bold text-sm text-slate-700 ${isScrolled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            <a href="#gallery" className="hover:text-[#FF1493] transition-all">Галерея</a>
            <a href="#about" className="hover:text-[#FF1493] transition-all">Для кого</a>
            <a href="#how-it-works" className="hover:text-[#FF1493] transition-all">Як працює</a>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            animate={isScrolled ? { rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(255,20,147,0)", "0px 10px 25px rgba(255,20,147,0.5)", "0px 0px 0px rgba(255,20,147,0)"] } : { rotate: 0, scale: 1, boxShadow: "0 10px 15px -3px rgba(255,20,147,0.3)" }} 
            transition={isScrolled ? { repeat: Infinity, duration: 1.5, repeatDelay: 2.5, ease: "easeInOut" } : { duration: 0.3 }} 
            onClick={(e) => {
              fireConfetti(e);
              sendClickToTelegram("Навігація: Замовити");
              setIsOrderModalOpen(true);
            }} 
            className="bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white px-6 py-2.5 rounded-full font-black shadow-lg shadow-[#FF1493]/30 text-sm tracking-wide pointer-events-auto"
          >
            Замовити
          </motion.button>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16 lg:pt-40 relative z-10 shrink-0" id="order-section">
        <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center max-w-4xl mx-auto mb-6 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight drop-shadow-sm">
            УНІКАЛЬНІ СТИЛЬНІ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1493] to-[#FF5F15]">РОЗМАЛЬОВКИ</span> <br />
            З ВЛАСНИХ ФОТО
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-semibold leading-relaxed mb-6">
            Ми можемо <b className="text-slate-800">створити</b> розмальовку ідентично по вашому фото або ж перенести головного героя у світ фантазій. Будь-яка тематика за вашим бажанням!
          </p>
          <div className="flex justify-center gap-2 md:gap-6 mt-8 md:mt-10 text-[9px] sm:text-xs md:text-sm font-bold text-slate-700 w-full px-1">
            <div className="relative bg-slate-100/80 backdrop-blur-sm pt-5 pb-2 px-2 md:pt-6 md:pb-4 md:px-8 rounded-xl md:rounded-2xl shadow-sm border border-white/50 flex items-center justify-center text-center w-full max-w-[160px] sm:max-w-[220px] md:max-w-[300px]">
              <div className="absolute -top-3.5 md:-top-5 left-1/2 -translate-x-1/2 bg-white w-7 h-7 md:w-10 md:h-10 rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <Palette className="text-[#FF5F15] w-3.5 h-3.5 md:w-5 md:h-5" /> 
              </div>
              <span className="whitespace-nowrap tracking-tighter sm:tracking-normal">Вже створили 100+ розмальовок</span>
            </div>
            <div className="relative bg-slate-100/80 backdrop-blur-sm pt-5 pb-2 px-2 md:pt-6 md:pb-4 md:px-8 rounded-xl md:rounded-2xl shadow-sm border border-white/50 flex items-center justify-center text-center w-full max-w-[160px] sm:max-w-[220px] md:max-w-[300px]">
              <div className="absolute -top-3.5 md:-top-5 left-1/2 -translate-x-1/2 bg-white w-7 h-7 md:w-10 md:h-10 rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <span className="text-[12px] md:text-xl leading-none">⏱️</span> 
              </div>
              <span className="whitespace-nowrap tracking-tighter sm:tracking-normal">Виготовлення від 1 до 3 днів!</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeRight} className="relative w-full max-w-[550px] mx-auto">
            <HeroCarousel />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeLeft} className="glass-card rounded-[2.5rem] p-6 md:p-10 w-full relative overflow-hidden shadow-2xl bg-slate-100/80 backdrop-blur-md border-white/80 mx-auto max-w-lg lg:max-w-xl">
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">СТВОРИ ЗАРАЗ</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Оберіть об'єм</p>
            </div>
            <div className="space-y-4 mb-4 relative z-10">
              {[9, 14, 23].map((num) => (
                <motion.button key={num} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPages(num)} className={`w-full flex flex-col p-4 md:p-5 rounded-2xl border-2 transition-colors duration-300 relative ${selectedPages === num ? 'border-[#FF5F15] bg-white shadow-xl scale-[1.02]' : 'border-white/80 hover:border-[#FF5F15]/50 bg-white/60 hover:bg-white'}`}>
                  <div className="flex items-center justify-between w-full">
                    {selectedPages === num && (
                      <motion.div layoutId="badge" className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[11px] uppercase font-black px-3 py-1 rounded-full shadow-lg">
                        {prices[num].label}
                      </motion.div>
                    )}
                    <span className="text-lg md:text-xl font-black flex items-center gap-3 text-slate-700">
                      <Palette size={24} className={selectedPages === num ? "text-[#FF5F15]" : "text-slate-400"} />
                      {num} арк.
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 line-through block mb-[-2px]">{prices[num].old} ₴</span>
                      <span className="text-xl md:text-2xl font-black text-slate-900">{prices[num].new} <span className="text-base">₴</span></span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedPages === num && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 pt-3 border-t border-slate-100/50 w-full overflow-hidden text-left">
                        <ul className="text-xs md:text-sm text-slate-600 space-y-2 font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600 shrink-0"/> Формат А4, преміум-папір</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600 shrink-0"/> Кольорова обкладинка на спіралі</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF1493] shrink-0"/> <b>{num} ваших фото</b>, перетворених у розмальовку</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 mb-6 mt-2 relative z-10">
              <div className="flex items-center gap-1.5 text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} className="text-green-600" /> Гарантія безпечної оплати
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.03, rotate: [-1, 1, -1, 0], boxShadow: "0 15px 30px -5px rgba(255, 95, 21, 0.5)" }} 
              whileTap={{ scale: 0.95 }} 
              onClick={(e) => {
                fireConfetti(e);
                sendClickToTelegram("Блок цін: Замовити розмальовку");
                setIsOrderModalOpen(true);
              }} 
              className="w-full bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white text-base md:text-lg font-black py-4 md:py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 relative z-10 tracking-wide whitespace-nowrap px-4"
            >
              ЗАМОВИТИ РОЗМАЛЬОВКУ <ChevronRight size={26} className="shrink-0" />
            </motion.button>
          </motion.div>
        </div>
      </main>

      <section id="gallery" className="py-16 relative overflow-hidden shrink-0 z-10">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center mb-8 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-4">ІДЕЇ ДЛЯ <span className="text-[#FF1493]">НАТХНЕННЯ!</span></h2>
            <p className="text-base md:text-lg text-slate-700 font-semibold max-w-4xl mx-auto leading-relaxed">
              Ми можемо <b className="text-slate-900">створити розмальовку ідентично по вашому оригінальному фото</b>, дбайливо зберігши кожну деталь, або ж перенести головного героя у захопливий <b className="text-[#FF1493]">світ фантазій</b> (космос, казки, улюблені професії). Усі ідеї та побажання детально обговорюються перед початком роботи!
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="flex justify-center w-full mb-8 px-4">
            <motion.div animate={{ scale: [1, 1.03, 1], boxShadow: ["0 5px 15px rgba(255,20,147,0.1)", "0 15px 25px rgba(255,20,147,0.25)", "0 5px 15px rgba(255,20,147,0.1)"] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="bg-slate-100/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full border-2 border-[#FF1493]/20 flex items-center justify-center gap-2 cursor-default whitespace-nowrap shadow-sm">
              <Sparkles className="text-[#FF5F15] shrink-0 w-4 h-4 md:w-5 md:h-5" /> 
              <span className="text-[#FF1493] font-black tracking-widest uppercase text-[10px] md:text-sm whitespace-nowrap">Натисни на фото, щоб побачити магію</span>
              <span className="text-sm md:text-xl drop-shadow-md shrink-0">👇</span>
            </motion.div>
          </motion.div>

          <div className="block md:hidden mb-10">
            <InfiniteMobileCarousel items={galleryData} onClick={setSelectedImageModal} />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger} className="hidden md:grid md:grid-cols-4 gap-8 max-w-[85rem] mx-auto px-4">
            {galleryData.map((role, idx) => (
              <GalleryItemPC key={idx} role={role} idx={idx} onClick={setSelectedImageModal} />
            ))}
          </motion.div>
        </div>
      </section>

      <section id="about" className="pt-2 pb-12 relative z-10 shrink-0">
        <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-100/75 backdrop-blur-md rounded-[2rem] p-8 md:p-12 text-center shadow-xl border border-white/85 relative overflow-hidden hover:shadow-2xl transition-shadow duration-500">
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

      <section id="how-it-works" className="py-20 bg-slate-100/50 backdrop-blur-md border-y border-white/50 shrink-0 relative z-10">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-3xl md:text-5xl font-black text-center mb-16">
            ЯК МИ СТВОРЮЄМО <span className="text-[#FF5F15]">МАГІЮ</span>
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Camera />, title: "1. Завантажте фото", desc: "Оберіть одне або кілька улюблених фотографій." },
              { icon: <MessageCircleHeart />, title: "2. Узгодження теми", desc: "Ми зв'яжемося з вами, щоб обрати бажаний стиль." },
              { icon: <Printer />, title: "3. Ми друкуємо", desc: "Наші майстри створюють контури та друкують." },
              { icon: <PackageOpen />, title: "4. Отримайте", desc: "Надійно пакуємо та швидко відправляємо поштою." }
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="relative h-full rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-center bg-slate-100/80 backdrop-blur-sm border-2 border-white/80 shadow-lg hover:shadow-[0_20px_40px_rgba(255,20,147,0.15)] flex flex-col items-center justify-start group overflow-hidden z-10">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#FF1493]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <motion.div 
                  whileInView={{ rotate: [0, -10, 10, -8, 8, -4, 4, 0] }} 
                  viewport={{ once: false, amount: 0.5 }} 
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 5, 0] }} 
                  className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-[#FF1493] to-[#FF5F15] rounded-2xl flex items-center justify-center text-white mb-5 md:mb-6 shadow-md shrink-0 z-10"
                >
                  {React.cloneElement(step.icon, { className: "w-7 h-7 md:w-9 md:h-9 drop-shadow-sm" })}
                </motion.div>

                <div className="flex flex-col flex-1 w-full relative z-10">
                  <div className="min-h-[48px] md:min-h-[64px] flex items-center justify-center mb-2">
                    <h3 className="text-base md:text-xl font-black text-slate-800 leading-tight group-hover:text-[#FF1493] transition-colors duration-300">{step.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed mt-auto transition-colors duration-300 group-hover:text-slate-800">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-20 shrink-0 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">ЧАСТІ <span className="text-[#FF1493]">ПИТАННЯ</span></h2>
            <p className="text-slate-600 font-medium">Зібрали відповіді на найпопулярніші запитання для вас</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger} className="flex flex-col gap-4 bg-slate-100/75 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/85 shadow-lg">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} faq={faq} isOpen={openFaqIndex === idx} onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} />
            ))}
          </motion.div>
        </div>
      </section>

      <section id="reviews" className="py-20 shrink-0 relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-3xl md:text-5xl font-black mb-12">ЩАСЛИВІ КЛІЄНТИ</motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger} className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "Олена М.", text: "Якість паперу супер, пружина міцна. Вся родина в захваті!" },
              { name: "Вікторія К.", text: "Зробили ідентично по нашому фото, вийшов крутий подарунок чоловіку." },
              { name: "Ірина С.", text: "Найкращий подарунок. Взяли максимальну на 23 аркуші, малюємо разом." }
            ].map((review, idx) => (
              <motion.div key={idx} variants={fadeUp} whileHover={{ scale: 1.03, y: -5, rotate: idx % 2 === 0 ? 1 : -1 }} className="glass-card rounded-[2rem] p-6 md:p-8 text-left bg-slate-100/80 backdrop-blur-md shadow-xl border-white/80">
                <div className="flex text-[#FF5F15] mb-4 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 italic mb-4 font-semibold text-sm md:text-base leading-relaxed">"{review.text}"</p>
                <p className="font-black text-lg text-slate-900">{review.name}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Кнопка "Залишити відгук" */}
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={(e) => {
                fireConfetti(e);
                setIsReviewModalOpen(true);
              }}
              className="bg-white text-[#FF1493] border-2 border-[#FF1493]/20 hover:border-[#FF1493] px-8 py-3.5 rounded-full font-black shadow-md text-sm md:text-base tracking-wide flex items-center gap-2 transition-colors"
            >
              <MessageSquarePlus size={20} /> Залишити відгук
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-100/80 backdrop-blur-lg border-t border-white/60 py-6 md:py-8 mt-auto shrink-0 w-full relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          <div className="font-black text-xl flex items-center gap-2 text-slate-800">
            <span className="text-[#FF5F15]">✏️ Моя </span> Розмальовка
          </div>
          <p className="text-slate-500 font-bold text-xs">© 2026 Всі права захищено.</p>
        </div>
      </footer>
    </div>
  );
}