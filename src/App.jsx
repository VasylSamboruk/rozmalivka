import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, Camera, Printer, PackageOpen, 
  Palette, Star, Sparkles, MessageCircleHeart,
  X, ChevronsLeftRight, Heart, CheckCircle2, ChevronDown,
  Send, ShieldCheck, MessageSquarePlus, Gift, CalendarDays, Sticker
} from 'lucide-react';
  import { covers } from './galleryManifest';
  import { calendarPhotos, livePhotos, stickerPhotos } from './media';

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
// canvas-confetti завантажується динамічно (code-splitting), а не в основний бандл,
// щоб не збільшувати початковий JS, який вантажиться при відкритті сайту.
let confettiModulePromise = null;
const fireConfetti = () => {
  if (!confettiModulePromise) {
    confettiModulePromise = import('canvas-confetti');
  }
  confettiModulePromise.then(({ default: confetti }) => {
    confetti({
      particleCount: 100,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.5 },
      zIndex: 9999,
      colors: ['#FF1493', '#FF5F15', '#FFD700', '#00C9FF', '#92FE9D']
    });
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

const galleryData = covers.map((cover) => ({
  text: cover.title,
  orig: cover.thumb,
  draw: cover.src,
  look: true,
    locked: true,
  }));

const faqs = [
  { q: "Що йде в подарунок до кожної розмальовки?", a: "До кожної книги — персональний календар формату А5 на 2027 рік і 2 стікерпаки А5, зібрані з ваших фото. Це вже в ціні, без доплати." },
  { q: "Чи встигнемо до Миколая?", a: "Друк займає 1–3 дні, Нова Пошта зазвичай ще 1–2. Щоб комплект спокійно приїхав до 19 грудня, краще оформити замовлення до 14 грудня." },
  { q: "Що робити, якщо фото не дуже якісне?", a: "Наші дизайнери можуть значно покращити якість більшості фото під час обробки. Якщо ж фото зовсім не підходить для якісного результату, ми обов'язково повідомимо вас і попросимо інший варіант перед початком роботи." },
  { q: "Скільки правок/узгоджень включено в ціну?", a: "Ми завжди погоджуємо з вами ескізи перед тим, як відправити їх до друку. У вартість включено до 3-х безкоштовних правок, щоб ви були на 100% задоволені результатом." },
  { q: "Чи можна кілька людей/персонажів в одній розмальовці?", a: "Так, звичайно! Ми можемо об'єднати людей з різних фотографій в один спільний гармонійний сюжет без жодних доплат." },
  { q: "Які терміни виготовлення та доставки?", a: "Виготовлення займає від 1 до 3 днів! Після цього ми відправляємо замовлення Новою Поштою (доставка зазвичай займає 1-2 дні)." },
  { q: "Як відбувається оплата?", a: "Ми працюємо по повній передоплаті. Оскільки кожна розмальовка — це унікальний товар, який малюється та друкується індивідуально під ваше замовлення, ми беремо повну оплату перед запуском у виробництво." },
  { q: "Чи можна замовити для дорослого/у подарунок?", a: "Абсолютно! Це один із найпопулярніших форматів. Розмальовки-антистрес, сімейні сюжети або love-story — чудовий та оригінальний подарунок для дорослих." },
  { q: "Що робити, якщо результат не сподобався?", a: "Оскільки ми погоджуємо кожен макет перед друком, сюрпризів не буде. Якщо ж на етапі ескізу вам зовсім не сподобається напрямок, ми обов'язково переробимо його." }
];

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
          
          {!data.look && (
          <div className="text-center absolute top-12 w-full pointer-events-none z-50">
            <p className="text-[#FF1493] font-black text-lg mt-2 uppercase tracking-widest drop-shadow-md">Тягни лінію вліво/вправо</p>
          </div>
          )}

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={springConfig}
            ref={containerRef}
            className="relative w-full max-w-2xl aspect-[3/4] md:aspect-square rounded-3xl overflow-hidden cursor-ew-resize select-none bg-slate-900 border-2 border-white/20 shadow-2xl mt-10"
            onMouseDown={handleStart} onTouchStart={handleStart} onMouseMove={handleMove} onTouchMove={handleMove}
          >
            {data.type === 'video' ? (
              <video src={data.draw} controls playsInline className="absolute inset-0 w-full h-full object-contain bg-black" />
            ) : (
            <img src={data.draw} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-contain bg-white pointer-events-none" alt="Обкладинка розмальовки" />
            )}
            {!data.look && (<>
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-white/80 shadow-[2px_0_10px_rgba(0,0,0,0.5)]" style={{ width: `${position}%` }}>
              <img src={data.orig} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ width: '100vw', maxWidth: containerRef.current?.offsetWidth || '100%' }} alt="Оригінал" />
            </div>
            
            <div className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none" style={{ left: `${position}%` }}>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.4)] text-[#FF1493] -ml-6 border-4 border-white/50">
                <ChevronsLeftRight size={28} />
              </div>
            </div>
                            </>)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfiniteMobileCarousel = React.memo(({ items, onClick }) => {
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
        onClick={() => { if (offset !== 0) setActive(active + offset); else if (!item.locked) onClick(item); }}
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
});

const GalleryItemPC = React.memo(({ role, idx, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div 
      variants={fadeUp} whileHover={{ scale: 1.05, y: -10, rotate: [0, -3, 3, -3, 2, 0], transition: { duration: 0.5 } }} 
      className={`glass-frame p-2 aspect-[3/4] flex flex-col shadow-xl relative overflow-hidden group border-white/80 w-full max-w-[300px] mx-auto transition-shadow ${role.locked ? 'cursor-default' : 'cursor-pointer hover:shadow-[0_20px_40px_rgba(255,20,147,0.3)]'}`}
            onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)} onClick={() => { if (!role.locked) onClick(role); }}
    >
      <div className="w-full h-full rounded-xl relative overflow-hidden bg-slate-100 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 z-0 pointer-events-none">
          <Camera size={32} />
        </div>
        <img src={role.orig} loading="lazy" decoding="async" width={300} height={400} className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" alt={role.text || 'Обкладинка'} />
                {!role.look && <motion.div
          initial={{ clipPath: "inset(0 0 0 0)" }} animate={{ clipPath: isActive ? "inset(0 100% 0 0)" : "inset(0 0 0 0)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }} className="absolute inset-0 z-20 pointer-events-none"
        >
          <img src={role.draw} loading="lazy" decoding="async" width={300} height={400} className="w-full h-full object-cover pointer-events-none" alt="Оригінал" />
                  </motion.div>}
      </div>
    </motion.div>
  );
});

const FaqItem = React.memo(({ faq, isOpen, idx, onToggle }) => {
  return (
    <motion.div 
      variants={fadeUp}
      className={`border-2 transition-colors duration-300 rounded-2xl overflow-hidden cursor-pointer ${isOpen ? 'border-[#FF5F15] bg-white shadow-md' : 'border-white bg-white hover:bg-slate-50'}`}
      onClick={() => onToggle(idx)}
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
});

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
    const message = `📞 <b>Нова заявка — передзвоніть</b>\n\n📱 <b>Номер телефону:</b> ${contact}`;

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
                        <p className="text-slate-700 font-bold mb-4 text-sm leading-relaxed">
                          Залиште номер телефону — ми зателефонуємо і все оформимо.
                        </p>

                        <div className="w-full mb-5">
                          <p className="text-[#FF1493] font-black mb-2 text-xs uppercase tracking-widest">Ваш номер телефону</p>
              
              {success ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 text-green-600 p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-green-200">
                  <CheckCircle2 size={18} /> Заявку прийнято!
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <input 
                                      type="tel"
                                      inputMode="tel"
                                      autoComplete="tel"
                                      value={contact}
                                      onChange={(e) => setContact(e.target.value)}
                                      placeholder="+380"
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

                            <div className="w-full relative mt-1 pt-5 border-t border-slate-200">
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ECEEF1] px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Або</div>
                              <div className="w-full flex flex-col gap-3">
                                <a href="https://instagram.com/my_rozm" target="_blank" rel="noreferrer" onClick={(e) => trackContactClick('Instagram', e)} className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#fd1d1d]/30">
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                  Instagram
                                </a>
                                <a href="https://t.me/my_rozm" target="_blank" rel="noreferrer" onClick={(e) => trackContactClick('Telegram', e)} className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0088cc]/30">
                                  <Send size={20} /> Telegram
                                </a>
                              </div>
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

const ExampleGrid = ({ photos, empty, onOpen }) => {
  if (!photos.length) {
    return (
      <div className="max-w-xl mx-auto bg-slate-100/80 border border-white rounded-[2rem] px-6 py-8 text-center text-slate-600 font-semibold">
        {empty}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-[85rem] mx-auto px-4">
      {photos.map((src) => (
        <button key={src} type="button" onClick={() => onOpen(src)} className="glass-frame p-2 aspect-[4/3] overflow-hidden bg-white">
                  <img src={src} alt="Приклад календаря або наклейок" loading="lazy" decoding="async" className="w-full h-full object-contain rounded-xl" />
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [selectedPages, setSelectedPages] = useState(14);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [exampleTab, setExampleTab] = useState('covers');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Стабільний колбек (не пересоздається на кожному рендері), щоб FaqItem,
  // обгорнутий у React.memo, не перемальовувався даремно.
  const toggleFaq = useCallback((idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  }, []);

  // useMemo — об'єкт цін більше не створюється заново на кожен рендер.
  const prices = useMemo(() => ({
    9: { old: 500, new: 400, label: 'Lite' },
    14: { old: 620, new: 550, label: 'PRO' },
    23: { old: 1010, new: 700, label: 'Maximum' }
  }), []);

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
          {/* 
            ВАЖЛИВО: раніше тут було ДВА <img> (мобільний + десктопний), і браузер
            завантажував ОБИДВА зображення одразу, навіть те, яке приховане через CSS
            (display: none все одно не скасовує завантаження <img src="">).
            <picture> вирішує це на рівні браузера: завантажується лише 1 файл,
            залежно від ширини екрана. Візуально нічого не змінилось.
          */}
          <picture>
            <source media="(min-width: 768px)" srcSet="/fonik.webp" />
            <img 
              src="/fonik2.webp" 
              alt="Фон" 
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </picture>
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
                        <a href="#real" className="hover:text-[#FF1493] transition-all">Вживу</a>
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
        <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-[#FF1493]/20 text-[#FF1493] font-black text-[11px] md:text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                      <Gift size={15} /> Акція
          </div>
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

          <div className="max-w-5xl mx-auto mb-6 md:mb-8">
            <div className="rounded-[1.2rem] md:rounded-[2rem] overflow-hidden border border-white/80 bg-slate-100/80 shadow-xl backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white text-center font-black uppercase tracking-wide md:tracking-widest text-[10px] md:text-sm py-2.5 px-3 flex items-center justify-center gap-2">
                <Gift size={15} className="shrink-0" /> До кожної розмальовки — подарунок уже в ціні
              </div>
              <div className="flex flex-col md:flex-row md:items-stretch divide-y divide-slate-200/80 md:divide-y-0">
                {[
                  { icon: Palette, title: 'Розмальовка', text: 'А4, обкладинка та пружина. Ваші фото стають сторінками.', badge: 'Ви замовляєте', gift: false },
                  { icon: CalendarDays, title: 'Календар А5', text: 'Персональний календар із ваших фото на 2027 рік.', badge: 'У подарунок', gift: true },
                  { icon: Sticker, title: '2 стікерпаки', text: 'Два набори формату А5 з ваших фото.', badge: 'У подарунок', gift: true },
                ].map((item, index) => (
                  <div key={item.title} className="flex flex-col md:flex-row md:flex-1 md:items-stretch">
                    {index > 0 && (
                      <div className="hidden md:flex items-center justify-center md:px-1">
                        <span className="my-1 md:my-0 w-7 h-7 rounded-full bg-white border border-[#FF1493]/20 text-[#FF1493] font-black flex items-center justify-center shadow-sm">+</span>
                      </div>
                    )}
                    <div className="flex flex-row items-center gap-3 md:flex-1 md:flex-col md:justify-center md:gap-0 px-3 py-2.5 md:px-4 md:py-6 text-left md:text-center">
                      <div className={`shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-md md:mx-auto md:mb-2 ${item.gift ? 'bg-gradient-to-br from-[#FF5F15] to-[#FF1493]' : 'bg-slate-800'}`}>
                        <item.icon size={19} className="md:w-[22px] md:h-[22px]" />
                      </div>
                      <div className="min-w-0 flex-1 md:flex-none">
                        <p className="font-black text-sm md:text-lg text-slate-800">{item.title}</p>
                        <p className="text-[11px] md:text-sm text-slate-600 font-semibold mt-0.5 md:mt-1 leading-snug md:leading-relaxed">{item.text}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 md:mt-3 text-[9px] md:text-[10px] font-black uppercase tracking-wide px-2 py-1 md:px-2.5 rounded-full ${item.gift ? 'text-white bg-gradient-to-r from-[#FF5F15] to-[#FF1493]' : 'text-slate-700 bg-white border border-slate-200'}`}>
                        {item.gift && <Gift size={11} />} {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

                          <div className="max-w-5xl mx-auto">
                            <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="glass-card rounded-[1.6rem] md:rounded-[2.5rem] p-4 pt-5 md:p-8 w-full relative shadow-2xl bg-slate-100/80 backdrop-blur-md border-white/80">
                              <div className="text-center mb-4 md:mb-6 relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">СТВОРИ ЗАРАЗ</h2>
                                <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Оберіть об'єм — подарунки вже в ціні</p>
                              </div>
                              <div className="flex flex-col md:grid md:grid-cols-3 gap-2.5 md:gap-4 mb-4 relative z-10">
                                                              {[9, 14, 23].map((num) => {
                                                                const open = selectedPages === num;
                                                                return (
                                                                  <button
                                                                    key={num}
                                                                    type="button"
                                                                    onClick={() => setSelectedPages(num)}
                                                                    className={`relative flex flex-col rounded-2xl border-2 px-4 py-3 md:px-4 md:py-5 text-left md:text-center transition ${open ? 'border-[#FF5F15] bg-white shadow-xl' : 'border-white/80 bg-white/60 hover:bg-white'}`}
                                                                  >
                                                                    {num === 14 && <span className="absolute -top-2.5 right-3 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">Найчастіше</span>}
                                                                    <span className="flex items-center justify-between w-full md:flex-col">
                                                                      <span>
                                                                        <span className={`block text-[10px] font-black uppercase tracking-wide ${num === 14 ? 'text-[#FF1493]' : 'text-slate-400'}`}>{prices[num].label}</span>
                                                                        <span className="block text-lg md:text-2xl font-black text-slate-800">{num} аркушів</span>
                                                                      </span>
                                                                      <span className="text-right md:text-center md:mt-2">
                                                                        <span className="block text-xs font-bold text-slate-400 line-through">{prices[num].old} ₴</span>
                                                                        <span className="block text-2xl md:text-3xl font-black text-slate-900 leading-none">{prices[num].new} ₴</span>
                                                                      </span>
                                                                    </span>
                                                                    <span className="mt-2 md:mt-3 inline-flex items-center gap-1.5 self-center rounded-full border border-[#FF1493]/15 bg-gradient-to-r from-[#FF5F15]/10 to-[#FF1493]/10 pl-1 pr-2.5 py-1 shadow-sm">
                                                                      <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white flex items-center justify-center shrink-0"><Gift size={11} /></span>
                                                                      <span className="text-[10px] font-black uppercase tracking-wide text-[#FF1493]">Подарунок</span>
                                                                    </span>
                                                                                                                                          <AnimatePresence initial={false}>
                                                                                                                                            {open && (
                                                                                                                                              <motion.div
                                                                                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                                                                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                                                                                                                                className="md:hidden w-full overflow-hidden"
                                                                                                                                              >
                                                                                                                                                <div className="mt-3 pt-3 border-t border-[#FF1493]/15 space-y-2 text-left">
                                                                                                                                                  {[
                                                                                                                                                    { icon: CheckCircle2, tone: 'text-green-600', text: 'Формат А4, преміум-папір' },
                                                                                                                                                    { icon: CheckCircle2, tone: 'text-green-600', text: 'Кольорова обкладинка на спіралі' },
                                                                                                                                                    { icon: Palette, tone: 'text-[#FF1493]', text: `${num} ваших фото у розмальовці` },
                                                                                                                                                    { icon: CalendarDays, tone: 'text-[#FF5F15]', text: 'Календар А5 на 2027 з ваших фото' },
                                                                                                                                                    { icon: Sticker, tone: 'text-[#FF5F15]', text: '2 стікерпаки А5 з ваших фото' },
                                                                                                                                                  ].map((row) => (
                                                                                                                                                    <p key={row.text} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                                                                                                                                      <row.icon size={14} className={`${row.tone} shrink-0`} />
                                                                                                                                                      {row.text}
                                                                                                                                                    </p>
                                                                                                                                                  ))}
                                                                                                                                                </div>
                                                                                                                                              </motion.div>
                                                                                                                                            )}
                                                                                                                                          </AnimatePresence>
                                                                                                                                        </button>
                                                                );
                                                              })}
                                                            </div>
                                                            <AnimatePresence mode="wait">
                                                              <motion.div
                                                                key={selectedPages}
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.32, ease: 'easeOut' }}
                                                                className="hidden md:block overflow-hidden mb-4 relative z-10"
                                                              >
                                                                <div className="rounded-[1.4rem] border-2 border-[#FF1493]/20 bg-white p-4 md:p-5 shadow-sm">
                                                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                                    <p className="font-black text-slate-800 text-base md:text-lg">{prices[selectedPages].label} · {selectedPages} аркушів</p>
                                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white text-[10px] font-black uppercase tracking-wide px-3 py-1.5">
                                                                      <Gift size={13} /> Уже в ціні
                                                                    </span>
                                                                  </div>
                                                                  <div className="grid sm:grid-cols-2 gap-2">
                                                                    {[
                                                                      { icon: CheckCircle2, tone: 'text-green-600', text: 'Формат А4, преміум-папір' },
                                                                      { icon: CheckCircle2, tone: 'text-green-600', text: 'Кольорова обкладинка на спіралі' },
                                                                      { icon: Palette, tone: 'text-[#FF1493]', text: `${selectedPages} ваших фото у розмальовці` },
                                                                      { icon: CalendarDays, tone: 'text-[#FF5F15]', text: 'Календар А5 на 2027 з ваших фото', gift: true },
                                                                      { icon: Sticker, tone: 'text-[#FF5F15]', text: '2 стікерпаки А5 з ваших фото', gift: true },
                                                                    ].map((row) => (
                                                                      <div key={row.text} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 ${row.gift ? 'bg-gradient-to-r from-[#FF5F15]/10 to-[#FF1493]/10 sm:col-span-1' : 'bg-slate-50'}`}>
                                                                        <row.icon size={16} className={`${row.tone} shrink-0`} />
                                                                        {row.text}
                                                                      </div>
                                                                    ))}
                                                                  </div>
                                                                </div>
                                                              </motion.div>
                                                            </AnimatePresence>
                              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 relative z-10">
                                <ShieldCheck size={16} className="text-green-600" /> Гарантія безпечної оплати
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                  fireConfetti(e);
                                  sendClickToTelegram("Блок цін: Замовити розмальовку");
                                  setIsOrderModalOpen(true);
                                }}
                                className="w-full bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white text-base md:text-xl font-black py-4 md:py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 relative z-10"
                              >
                                ЗАМОВИТИ · {prices[selectedPages].new} ₴ <ChevronRight size={24} />
                              </motion.button>
                            </motion.div>
                          </div>
      </main>

      <section id="gallery" className="py-16 relative overflow-hidden shrink-0 z-10">
        <div className="max-w-7xl mx-auto px-0 md:px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center mb-8 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-4">ОБКЛАДИНКИ, ЯКІ <span className="text-[#FF1493]">ВЖЕ ЗРОБИЛИ</span></h2>
            <p className="text-base md:text-lg text-slate-700 font-semibold max-w-4xl mx-auto leading-relaxed">
              Ми можемо <b className="text-slate-900">створити розмальовку ідентично по вашому оригінальному фото</b>, дбайливо зберігши кожну деталь, або ж перенести головного героя у захопливий <b className="text-[#FF1493]">світ фантазій</b> (космос, казки, улюблені професії). Усі ідеї та побажання детально обговорюються перед початком роботи!
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 px-4">
                      {[
                        { id: 'covers', label: 'Обкладинки' },
                        { id: 'calendars', label: 'Приклади календариків' },
                        { id: 'stickers', label: 'Приклади наклейок' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setExampleTab(tab.id)}
                          className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-black transition ${exampleTab === tab.id ? 'bg-gradient-to-r from-[#FF5F15] to-[#FF1493] text-white shadow-lg' : 'bg-white/80 text-slate-700 border border-white'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {exampleTab === 'covers' && (
                      <>
                    <div className="block md:hidden mb-10">
                      <InfiniteMobileCarousel items={galleryData} onClick={setSelectedImageModal} />
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={stagger} className="hidden md:grid md:grid-cols-4 gap-8 max-w-[85rem] mx-auto px-4">
                      {galleryData.map((role, idx) => (
                        <GalleryItemPC key={idx} role={role} idx={idx} onClick={setSelectedImageModal} />
                      ))}
                    </motion.div>
                      </>
                    )}

                    {exampleTab !== 'covers' && (
                      <ExampleGrid
                        photos={exampleTab === 'calendars' ? calendarPhotos : stickerPhotos}
                        empty={exampleTab === 'calendars' ? 'Приклади календариків з’являться тут, щойно додамо фото.' : 'Приклади наклейок з’являться тут, щойно додамо фото.'}
                        onOpen={(src) => setSelectedImageModal({ look: true, draw: src, orig: src })}
                      />
                    )}
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
              <FaqItem key={idx} faq={faq} isOpen={openFaqIndex === idx} idx={idx} onToggle={toggleFaq} />
            ))}
          </motion.div>
        </div>
      </section>

      <section id="real" className="py-16 shrink-0 relative z-10">
              <div className="max-w-6xl mx-auto px-4">
                <motion.div initial="hidden" whileInView="visible" viewport={scrollConfig} variants={fadeUp} className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-black mb-4">ЯК ЦЕ <span className="text-[#FF1493]">ВИГЛЯДАЄ ВЖИВУ</span></h2>
                  <p className="text-base md:text-lg text-slate-700 font-semibold max-w-3xl mx-auto mb-6">Реальні фото замовлень. Відео і ще більше кадрів — в Instagram.</p>
                  <a href="https://instagram.com/my_rozm" target="_blank" rel="noreferrer" onClick={() => sendClickToTelegram('Галерея: Instagram')} className="inline-flex bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black px-6 py-3.5 rounded-full shadow-lg">
                    Дивитись в Instagram
                  </a>
                </motion.div>
                {livePhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
                    {livePhotos.map((src) => (
                      <button key={src} type="button" onClick={() => setSelectedImageModal({ look: true, type: src.match(/\.(mp4|webm)$/i) ? 'video' : 'image', draw: src, orig: src })} className="glass-frame p-1.5 overflow-hidden aspect-[3/4]">
                        {src.match(/\.(mp4|webm)$/i) ? (
                          <video src={src} muted playsInline className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <img src={src} alt="Розмальовка вживу" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-xl" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
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
          <p className="text-slate-500 font-bold text-xs text-center">Персональні розмальовки по фото. Доставка Новою Поштою по Україні. © 2026</p>
        </div>
      </footer>
    </div>
  );
}
