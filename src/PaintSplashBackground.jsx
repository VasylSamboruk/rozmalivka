import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PaintSplashBackground() {
  const { scrollYProgress } = useScroll();

  const waterLevel = useTransform(scrollYProgress, [0, 1], [350, -50]);

  return (
    <div className="relative min-h-[400vh] w-full bg-[#FAFAFA] overflow-hidden font-sans">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        
        {/* 1. Велика Рожева */}
        <div className="absolute top-[3%] left-[-25%] md:left-[-6%] w-[320px] md:w-[420px] h-[320px] md:h-[420px]">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="mask1">
                <path d="M250,50 C280,70 320,40 350,70 C380,100 420,80 440,120 C460,160 490,190 470,230 C450,270 480,310 440,340 C400,370 420,420 380,440 C340,460 300,430 260,450 C220,470 180,440 140,450 C100,460 70,420 50,380 C30,340 10,300 30,260 C50,220 20,180 50,140 C80,100 120,120 150,90 C180,60 220,30 250,50 Z" />
              </clipPath>
            </defs>
            <path d="M250,50 C280,70 320,40 350,70 C380,100 420,80 440,120 C460,160 490,190 470,230 C450,270 480,310 440,340 C400,370 420,420 380,440 C340,460 300,430 260,450 C220,470 180,440 140,450 C100,460 70,420 50,380 C30,340 10,300 30,260 C50,220 20,180 50,140 C80,100 120,120 150,90 C180,60 220,30 250,50 Z" className="fill-[#FF1493]/10 stroke-[#FF1493]/40 stroke-[3]" />
            <g clipPath="url(#mask1)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,50 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,150 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,50 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="fill-[#FF1493]/50"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* МАЛА КЛЯКСА 1 */}
        <div className="absolute top-[18%] right-[5%] md:right-[8%] w-[150px] md:w-[200px] h-[150px] md:h-[200px] opacity-75">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="maskSmall1">
                <path d="M250,60 C290,80 330,50 360,90 C390,130 430,110 440,150 C450,190 480,230 460,270 C440,310 470,350 430,380 C390,410 350,380 310,400 C270,420 230,390 190,400 C150,410 120,370 100,330 C80,290 50,260 70,220 C90,180 60,140 90,100 C120,60 210,40 250,60 Z" />
              </clipPath>
            </defs>
            <path d="M250,60 C290,80 330,50 360,90 C390,130 430,110 440,150 C450,190 480,230 460,270 C440,310 470,350 430,380 C390,410 350,380 310,400 C270,420 230,390 190,400 C150,410 120,370 100,330 C80,290 50,260 70,220 C90,180 60,140 90,100 C120,60 210,40 250,60 Z" className="fill-[#00BFFF]/10 stroke-[#00BFFF]/40 stroke-[3]" />
            <g clipPath="url(#maskSmall1)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,40 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,130 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,40 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="fill-[#00BFFF]/45"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* 2. Велика Помаранчева */}
        <div className="absolute top-[35%] right-[-25%] md:right-[-7%] w-[350px] md:w-[450px] h-[350px] md:h-[450px]">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="mask2">
                <path d="M250,30 C290,50 310,20 340,50 C370,80 410,60 430,100 C450,140 480,160 470,200 C460,240 490,280 460,320 C430,360 450,400 410,430 C370,460 330,430 290,450 C250,470 210,430 170,440 C130,450 90,410 70,370 C50,330 20,300 40,260 C60,220 30,180 60,140 C90,100 130,120 170,90 C210,60 210,10 250,30 Z" />
              </clipPath>
            </defs>
            <path d="M250,30 C290,50 310,20 340,50 C370,80 410,60 430,100 C450,140 480,160 470,200 C460,240 490,280 460,320 C430,360 450,400 410,430 C370,460 330,430 290,450 C250,470 210,430 170,440 C130,450 90,410 70,370 C50,330 20,300 40,260 C60,220 30,180 60,140 C90,100 130,120 170,90 C210,60 210,10 250,30 Z" className="fill-[#FF5F15]/10 stroke-[#FF5F15]/40 stroke-[3]" />
            <g clipPath="url(#mask2)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,40 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,140 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,40 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="fill-[#FF5F15]/50"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* МАЛА КЛЯКСА 2 */}
        <div className="absolute top-[52%] left-[4%] md:left-[6%] w-[140px] md:w-[180px] h-[140px] md:h-[180px] opacity-75">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="maskSmall2">
                <path d="M240,40 C280,65 310,30 350,70 C390,110 420,80 430,130 C440,180 480,220 460,270 C440,320 470,360 420,400 C370,440 330,400 290,430 C250,460 200,410 160,430 C120,450 90,400 70,350 C50,300 20,260 40,210 C60,160 30,120 70,80 C110,40 200,15 240,40 Z" />
              </clipPath>
            </defs>
            <path d="M240,40 C280,65 310,30 350,70 C390,110 420,80 430,130 C440,180 480,220 460,270 C440,320 470,360 420,400 C370,440 330,400 290,430 C250,460 200,410 160,430 C120,450 90,400 70,350 C50,300 20,260 40,210 C60,160 30,120 70,80 C110,40 200,15 240,40 Z" className="fill-[#FF1493]/10 stroke-[#FF1493]/40 stroke-[3]" />
            <g clipPath="url(#maskSmall2)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,60 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,130 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,60 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="fill-[#FF1493]/45"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* 3. Велика Фіолетова */}
        <div className="absolute top-[65%] left-[-25%] md:left-[-5%] w-[350px] md:w-[400px] h-[350px] md:h-[400px]">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="mask3">
                <path d="M220,40 C270,60 300,20 340,60 C380,100 410,70 430,120 C450,170 490,200 470,250 C450,300 470,350 430,390 C390,430 340,400 300,440 C260,480 210,430 160,450 C110,470 80,410 50,360 C20,310 40,260 20,210 C0,160 40,120 70,80 C100,40 170,20 220,40 Z" />
              </clipPath>
            </defs>
            <path d="M220,40 C270,60 300,20 340,60 C380,100 410,70 430,120 C450,170 490,200 470,250 C450,300 470,350 430,390 C390,430 340,400 300,440 C260,480 210,430 160,450 C110,470 80,410 50,360 C20,310 40,260 20,210 C0,160 40,120 70,80 C100,40 170,20 220,40 Z" className="fill-[#9400D3]/10 stroke-[#9400D3]/40 stroke-[3]" />
            <g clipPath="url(#mask3)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,50 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,140 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,50 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="fill-[#9400D3]/45"
                />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* 4. Велика Блакитна */}
        <div className="absolute top-[85%] right-[-25%] md:right-[-6%] w-[360px] md:w-[420px] h-[360px] md:h-[420px]">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <clipPath id="mask4">
                <path d="M250,40 C300,50 330,20 370,60 C410,100 440,80 460,130 C480,180 500,220 470,270 C440,320 460,370 420,410 C380,450 320,420 280,460 C240,500 190,440 140,460 C90,480 60,420 40,370 C20,320 50,270 30,220 C10,170 50,130 80,90 C110,50 200,30 250,40 Z" />
              </clipPath>
            </defs>
            <path d="M250,40 C300,50 330,20 370,60 C410,100 440,80 460,130 C480,180 500,220 470,270 C440,320 460,370 420,410 C380,450 320,420 280,460 C240,500 190,440 140,460 C90,480 60,420 40,370 C20,320 50,270 30,220 C10,170 50,130 80,90 C110,50 200,30 250,40 Z" className="fill-[#00BFFF]/10 stroke-[#00BFFF]/40 stroke-[3]" />
            <g clipPath="url(#mask4)">
              <motion.g style={{ y: waterLevel }}>
                <motion.path
                  animate={{
                    d: [
                      "M-100,100 Q75,60 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,130 250,100 T600,100 L600,600 L-100,600 Z",
                      "M-100,100 Q75,60 250,100 T600,100 L600,600 L-100,600 Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="fill-[#00BFFF]/45"
                />
              </motion.g>
            </g>
          </svg>
        </div>

      </div>

      <div className="relative z-10 flex flex-col items-center pt-32 px-4 text-center">
        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 max-w-lg mb-[70vh]">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">Жива хвиля рідини</h1>
          <p className="text-slate-600 text-sm md:text-base font-medium">Тепер внутрішня вода знову хвилюється та переливається, як справжня рідина!</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 max-w-lg mb-[70vh]">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Середина сторінки</h2>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 max-w-lg mb-[40vh]">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Кінець сторінки</h2>
        </div>
      </div>
    </div>
  );
}