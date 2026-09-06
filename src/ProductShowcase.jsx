import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ProductShowcase() {
  const animationTimes = [0, 0.2, 0.5, 0.8, 1];
  const duration = 5;

  // Подвійний салют конфеті (згори та знизу) одночасно зі стрибком кнопки
  useEffect(() => {
    const timer = setTimeout(() => {
      // Салют знизу
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6']
      });
      // Салют зверху
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.2 },
        colors: ['#2563eb', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6']
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Динамічні траєкторії для постійного пересування журналів місцями
  const centerBookVariants = {
    animate: {
      opacity: [0, 1, 1, 1, 1],
      scale: [0.3, 1.15, 0.9, 1.05, 1.05],
      y: [450, -40, 20, 0, 0],
      x: [0, 0, 120, 0, 0], 
      rotate: [180, 0, 15, 0, 0],
      rotateY: [360, 0, 0, 0, 0],
      zIndex: [30, 30, 10, 30, 30], 
      transition: { duration, times: animationTimes, ease: "easeInOut" }
    }
  };

  const leftBookVariants = {
    animate: {
      opacity: [0, 1, 1, 1, 1],
      scale: [0.3, 0.95, 1.05, 0.95, 0.95],
      y: [450, 30, -10, 15, 15],
      x: [0, -110, 0, -85, -85],
      rotate: [-180, -15, 0, -10, -10],
      rotateY: [-360, 0, 0, 0, 0],
      zIndex: [10, 10, 30, 10, 10], 
      transition: { duration, times: animationTimes, ease: "easeInOut" }
    }
  };

  const rightBookVariants = {
    animate: {
      opacity: [0, 1, 1, 1, 1],
      scale: [0.3, 0.95, 0.9, 0.95, 0.95],
      y: [450, 30, 30, 15, 15],
      x: [0, 110, -110, 85, 85],
      rotate: [180, 15, -15, 10, 10],
      rotateY: [360, 0, 0, 0, 0],
      zIndex: [20, 20, 20, 20, 20],
      transition: { duration, times: animationTimes, ease: "easeInOut" }
    }
  };

  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: -50, scale: 0.4 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.8, duration: 0.9 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 150, scale: 0.4 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 450, 
        damping: 12, 
        delay: 3.5 
      } 
    }
  };

  return (
    <motion.div 
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 7, ease: "linear", repeat: Infinity }}
      style={{ 
        background: "linear-gradient(-45deg, #ffffff, #f1f3f5, #e9ecef, #ffffff)", 
        backgroundSize: "400% 400%" 
      }}
      className="relative w-full h-screen max-w-md mx-auto overflow-hidden flex flex-col items-center justify-center font-sans"
    >
      
      {/* Текст */}
      <motion.div 
        variants={textContainer}
        initial="hidden"
        animate="show"
        className="mb-10 text-center z-40"
      >
        <motion.h2 variants={textItem} className="text-4xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
          Унікальна
        </motion.h2>
        <motion.h2 variants={textItem} className="text-3xl font-bold text-blue-600 mt-1 drop-shadow-md">
          твоя розмальовка
        </motion.h2>
      </motion.div>

      {/* Сцена журналів (абсолютно чисті зображення без жодних білих підкладок та рамки) */}
      <div className="relative w-full flex justify-center items-center h-[420px] mb-6" style={{ perspective: 1400 }}>
        
        {/* Лівий журнал */}
        <motion.div 
          animate="animate"
          variants={leftBookVariants}
          // Додано нескінченну плаваючу анімацію (float), щоб вони постійно жили і рухались
          whileInView={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute w-48 h-72 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden bg-transparent"
        >
          <img src="/1image.webp" alt="Розмальовка 1" className="w-full h-full object-cover rounded-2xl" />
        </motion.div>

        {/* Правий журнал */}
        <motion.div 
          animate="animate"
          variants={rightBookVariants}
          whileInView={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute w-48 h-72 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden bg-transparent"
        >
          <img src="/2image.webp" alt="Розмальовка 2" className="w-full h-full object-cover rounded-2xl" />
        </motion.div>

        {/* Центральний журнал */}
        <motion.div 
          animate="animate"
          variants={centerBookVariants}
          whileInView={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className="absolute w-56 h-80 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden bg-transparent"
        >
          <img src="/image.webp" alt="Головна розмальовка" className="w-full h-full object-cover rounded-2xl" />
        </motion.div>
      </div>

      {/* Кнопка з подвійним салютом */}
      <motion.button
        initial="hidden"
        animate="show"
        variants={buttonVariants}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative px-12 py-5 rounded-full font-black text-xl text-white 
                   bg-blue-600 shadow-[0_15px_35px_rgba(37,99,235,0.4)] overflow-hidden group z-40"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
        Замовити зараз
      </motion.button>

    </motion.div>
  );
}