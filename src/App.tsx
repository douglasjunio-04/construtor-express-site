import React, { useEffect, useRef, useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Layout, 
  Calculator, 
  ChevronDown,
  MessageCircle,
  Check,
  Award,
  Layers,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Gift,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type WheelPrize = {
  id: string;
  wheelLabel: string;
  wheelDisplayLabel: string;
  resultTitle: string;
  resultMessage: string;
  ctaLabel: string;
  href: string;
  isAllowed: boolean;
  couponCode?: string;
};

type StoredWheelPrize = {
  id: string;
  redeemedAt: number;
  expiresAt: number;
};

const WHEEL_STORAGE_KEY = 'construtor-express-wheel-prize-v1';
const WHEEL_PRIZE_DURATION_MS = 15 * 60 * 1000;
const isDevelopment = import.meta.env.DEV;

const wheelPrizes: WheelPrize[] = [
  {
    id: 'coupon-10',
    wheelLabel: 'Cupom 10%',
    wheelDisplayLabel: 'CUPOM\n10%',
    resultTitle: 'Cupom Projetos10',
    resultMessage: 'Para pedidos a partir do Mega Pack.',
    ctaLabel: 'Aplicar no Mega Pack',
    href: 'https://payfast.greenn.com.br/mx6qdv5/offer/n2h1Gy?ch_id=143967&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=',
    isAllowed: true,
    couponCode: 'projetos10'
  },
  {
    id: 'coupon-15',
    wheelLabel: 'Cupom 15%',
    wheelDisplayLabel: 'CUPOM\n15%',
    resultTitle: 'Cupom Projetos15',
    resultMessage: 'Para pedidos a partir do Mega Pack.',
    ctaLabel: 'Aplicar no Mega Pack',
    href: 'https://payfast.greenn.com.br/mx6qdv5/offer/n2h1Gy?ch_id=143967&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=',
    isAllowed: true,
    couponCode: 'projetos15'
  },
  {
    id: 'coupon-20',
    wheelLabel: 'Cupom 20%',
    wheelDisplayLabel: 'CUPOM\n20%',
    resultTitle: 'Cupom 20%',
    resultMessage: 'Prêmio ilustrativo da roleta.',
    ctaLabel: 'Ver planos',
    href: '#pricing',
    isAllowed: false
  },
  {
    id: 'calculator',
    wheelLabel: 'Calculadora de obra gratis',
    wheelDisplayLabel: 'CALCULADORA\nGRATIS',
    resultTitle: 'Calculadora de obra gratis',
    resultMessage: 'Prêmio ilustrativo da roleta.',
    ctaLabel: 'Ver planos',
    href: '#pricing',
    isAllowed: false
  },
  {
    id: 'ultra-discount',
    wheelLabel: 'Ultra Pack por R$37,90',
    wheelDisplayLabel: 'ULTRA PACK\nR$37,90',
    resultTitle: 'Ultra Pack por R$37,90',
    resultMessage: 'Você ganhou um super desconto em 500 projetos, clique no link abaixo e garanta essa condição apenas nessa tela.',
    ctaLabel: 'Garantir Ultra Pack por R$37,90',
    href: 'https://payfast.greenn.com.br/fer3kv5/offer/dXBDLA?ch_id=143967&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=',
    isAllowed: true,
    couponCode: 'ULTRA37'
  },
  {
    id: 'free-projects',
    wheelLabel: '10 projetos gratis',
    wheelDisplayLabel: '10 PROJETOS\nGRATIS',
    resultTitle: '10 projetos gratis',
    resultMessage: 'Prêmio ilustrativo da roleta.',
    ctaLabel: 'Ver planos',
    href: '#pricing',
    isAllowed: false
  }
];

const weightedPrizeTable = [
  { id: 'coupon-10', weight: 50 },
  { id: 'coupon-15', weight: 35 },
  { id: 'ultra-discount', weight: 15 }
] as const;

const confettiPieces = Array.from({ length: 24 }, (_, index) => index);

const getPrizeById = (prizeId: string) => wheelPrizes.find((prize) => prize.id === prizeId) ?? null;
const getPrizeIndexById = (prizeId: string) => wheelPrizes.findIndex((prize) => prize.id === prizeId);

const getWeightedPrizeIndex = () => {
  const totalWeight = weightedPrizeTable.reduce((sum, prize) => sum + prize.weight, 0);
  const randomValue = Math.random() * totalWeight;
  let accumulatedWeight = 0;

  for (const prize of weightedPrizeTable) {
    accumulatedWeight += prize.weight;

    if (randomValue < accumulatedWeight) {
      return getPrizeIndexById(prize.id);
    }
  }

  return getPrizeIndexById(weightedPrizeTable[weightedPrizeTable.length - 1].id);
};

const fachadas = [
  '/fachadas/477815-1bc7238f5894d2fe07e096ae2482aa67.png',
  '/fachadas/477815-20151ce5671db510061b1e9c63d4fce2.png',
  '/fachadas/477815-24420f1de705512ef6d3d2c538bbee7c.png',
  '/fachadas/477815-322cdecfd2d7b481295c32ebb7586990.png',
  '/fachadas/477815-395e060b6af1e6b48167f0894740e474.png',
  '/fachadas/477815-40f24191ec09379297228a95771c3fd9.png',
  '/fachadas/477815-46ede613f21ace11700dd298cec11e0d.png',
  '/fachadas/477815-4dc9241b38f9a33e383ba6e427634b45.png',
  '/fachadas/477815-5c7af31a19a9b8584102a58f47d4677c.png',
  '/fachadas/477815-5ca3cdcf739027892d28867a5273242a.png',
  '/fachadas/477815-61c0c5eadaacfe36a7b95ddf81b69b79.png',
  '/fachadas/477815-69420276b268cd816d37fa4a93b2e96c.png',
  '/fachadas/477815-6d02b9530713cd803d3430ef065861ef.png',
  '/fachadas/477815-7a90524a74ca83c8a1f42b53909f92cc.png',
  '/fachadas/477815-7de3c10008aed75f78266ad409a16b3e.png',
  '/fachadas/477815-7e0c121e5d314aaa17c286111d0d44af.png',
  '/fachadas/477815-8d465c2b58568d576cfe228be34e54c9.png',
  '/fachadas/477815-9219cba1c9caca81310e4f3fc058e0fa.png',
  '/fachadas/477815-93046e9f1fe52f16cbf0fdd59dbfee5e.png',
  '/fachadas/477815-9b7f568c32a922fd42abf7721f5f658b.png',
  '/fachadas/477815-a811449fb96d5c3b03fbdc986390e0dc.png',
  '/fachadas/477815-abd86bdfa14e53e95e4efa62339c540f.png',
  '/fachadas/477815-b1d041ea1200e3a85cebfec932d9f64c.png',
  '/fachadas/477815-b2bfd883cd96a5a75b37863a5f82f83b.png',
  '/fachadas/477815-b52be3e576fc9864b952f0d32aa80cea.png',
  '/fachadas/477815-b5f78ab9197eefe54057972ec6b1691b.png',
  '/fachadas/477815-c16d3504e9bc0137e65f55d3f2ed38ba.png',
  '/fachadas/477815-c47dfce06f54f5951e76b44ae8584244.png',
  '/fachadas/477815-c4a87adcd18a31ef4c6e7bf839426e06.png',
  '/fachadas/477815-c8036427f74d7c240d5e3979e7e8cf0b.png',
  '/fachadas/477815-d0e27db1fb4590f47a5197431451fe4b.png',
  '/fachadas/477815-db897b4be2d3b9d70adbcaa322b70de9.png',
  '/fachadas/477815-e2dd5fe3bfdc2483e823d0aef29c84af.png',
  '/fachadas/477815-e426895a298408ac107b5f2676d4c77a.png',
  '/fachadas/477815-e4377ef7e57ab61b546f0001c30300a5.png',
  '/fachadas/477815-f320834a618a20e014291a987be3414f.png',
  '/fachadas/477815-f491776c65bf8624d38c236711dc7198.png',
  '/fachadas/477815-f7e1007e083aa84616df28116514a86e.png',
];

const App = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isPricingInView, setIsPricingInView] = useState(false);
  const [showWheelInvite, setShowWheelInvite] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [awardedPrize, setAwardedPrize] = useState<WheelPrize | null>(null);
  const [prizeExpiresAt, setPrizeExpiresAt] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showWheelConfetti, setShowWheelConfetti] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [showPrizeDock, setShowPrizeDock] = useState(false);
  const [showWheelWidget, setShowWheelWidget] = useState(false);

  useEffect(() => {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPricingInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(pricingSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!isDevelopment) {
      try {
        const storedPrizeRaw = window.localStorage.getItem(WHEEL_STORAGE_KEY);
        if (storedPrizeRaw) {
          const storedPrize = JSON.parse(storedPrizeRaw) as StoredWheelPrize;
          const savedPrize = getPrizeById(storedPrize.id);

          if (savedPrize) {
            setAwardedPrize(savedPrize);
            setPrizeExpiresAt(storedPrize.expiresAt);
            setShowPrizeDock(true);
            setShowWheelInvite(false);
            setShowWheelModal(false);
            setShowWheelWidget(false);
          }

          return;
        }
      } catch {
        // Ignore storage access issues and allow the widget in-session.
      }
    }

    timer = setTimeout(() => {
      setShowWheelInvite(true);
      setShowWheelWidget(false);
    }, 3500);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (!prizeExpiresAt || currentTime >= prizeExpiresAt) return;

    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [prizeExpiresAt]);

  useEffect(() => {
    if (!showWheelConfetti) return;

    const timer = window.setTimeout(() => {
      setShowWheelConfetti(false);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [showWheelConfetti]);

  useEffect(() => {
    if (!copiedCoupon) return;

    const timer = window.setTimeout(() => {
      setCopiedCoupon(null);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [copiedCoupon]);

  const isPrizeExpired = prizeExpiresAt ? currentTime >= prizeExpiresAt : false;
  const countdownMs = prizeExpiresAt ? Math.max(prizeExpiresAt - currentTime, 0) : 0;
  const countdownMinutes = String(Math.floor(countdownMs / 60000)).padStart(2, '0');
  const countdownSeconds = String(Math.floor((countdownMs % 60000) / 1000)).padStart(2, '0');
  const countdownLabel = `${countdownMinutes}:${countdownSeconds}`;
  const isMegaCouponPrize = awardedPrize?.id === 'coupon-10' || awardedPrize?.id === 'coupon-15';
  const isUltraDiscountPrize = awardedPrize?.id === 'ultra-discount';

  const handlePrizePersist = (selectedPrize: WheelPrize) => {
    const expiresAt = Date.now() + WHEEL_PRIZE_DURATION_MS;

    setAwardedPrize(selectedPrize);
    setPrizeExpiresAt(expiresAt);
    setCurrentTime(Date.now());
    setShowWheelConfetti(true);
    setCopiedCoupon(null);
    setShowPrizeDock(true);
    setShowWheelModal(false);

    if (!isDevelopment) {
      try {
        window.localStorage.setItem(WHEEL_STORAGE_KEY, JSON.stringify({
          id: selectedPrize.id,
          redeemedAt: Date.now(),
          expiresAt
        } satisfies StoredWheelPrize));
      } catch {
        // If localStorage is unavailable, the prize remains unique for the current session.
      }
    }
  };

  const handleCloseWheelModal = () => {
    if (isWheelSpinning) return;
    setShowWheelModal(false);
    if (!awardedPrize) {
      setShowWheelInvite(false);
      setShowWheelWidget(true);
    }
  };

  const handleOpenWheelModal = () => {
    setShowWheelInvite(false);
    setShowWheelWidget(false);
    setShowWheelModal(true);
  };

  const handleDismissWheelInvite = () => {
    setShowWheelInvite(false);
    setShowWheelWidget(true);
  };

  const handleOpenWheelWidget = () => {
    setShowWheelWidget(false);
    setShowWheelModal(true);
  };

  const handleDismissPrizeDock = () => {
    setShowPrizeDock(false);
  };

  const handleCopyCoupon = async () => {
    if (!awardedPrize?.couponCode) return;

    try {
      await navigator.clipboard.writeText(awardedPrize.couponCode);
      setCopiedCoupon(awardedPrize.couponCode);
    } catch {
      setCopiedCoupon(null);
    }
  };

  const handleSpinWheel = () => {
    if (isWheelSpinning || awardedPrize) return;

    const selectedIndex = getWeightedPrizeIndex();
    if (selectedIndex < 0) return;

    const selectedPrize = wheelPrizes[selectedIndex];
    const sliceAngle = 360 / wheelPrizes.length;
    const prizeCenterAngle = (selectedIndex * sliceAngle) + (sliceAngle / 2);
    const targetRotation = wheelRotation + (360 * 6) + (360 - prizeCenterAngle);

    setIsWheelSpinning(true);
    setWheelRotation(targetRotation);

    window.setTimeout(() => {
      setIsWheelSpinning(false);
      setShowWheelInvite(false);
      handlePrizePersist(selectedPrize);
    }, 5200);
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-900 font-sans selection:bg-primary/20 selection:text-slate-950 overflow-x-hidden antialiased">
      <AnimatePresence>
        {showWheelInvite && !awardedPrize && (
          <div className="fixed inset-0 z-[205] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-[2rem] border border-slate-200 bg-[#fffaf3] p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={handleDismissWheelInvite}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-700 shadow-lg transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-slate-950">
                Voce ganhou um giro da sorte
              </h3>
              <button
                type="button"
                onClick={handleOpenWheelModal}
                className="cta-pulse mt-5 w-full rounded-2xl bg-primary px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:scale-[1.01]"
              >
                Toque para receber
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWheelWidget && !showWheelInvite && !showWheelModal && !awardedPrize && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            onClick={handleOpenWheelWidget}
            className="fixed bottom-5 right-4 z-[204] flex items-center gap-3 rounded-full border border-primary/20 bg-white/95 px-4 py-3 text-left shadow-[0_20px_45px_rgba(15,23,42,0.16)] backdrop-blur-md transition hover:scale-[1.02] md:bottom-8 md:right-8"
          >
            <span className="cta-pulse flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <Gift className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                Giro Da Sorte
              </span>
              <span className="block text-sm font-black uppercase text-slate-950">
                Abrir Roleta
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWheelModal && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center overflow-hidden p-3 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseWheelModal}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="hide-scrollbar relative w-full max-w-lg overflow-x-hidden md:max-h-[90vh] md:overflow-y-auto"
            >
              {showWheelConfetti && (
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                  {confettiPieces.map((piece) => (
                    <span
                      key={piece}
                      className="wheel-confetti-piece"
                      style={{
                        left: `${(piece * 11) % 96}%`,
                        animationDelay: `${(piece % 6) * 0.12}s`,
                        backgroundColor: ['#2563eb', '#f59e0b', '#16a34a', '#dc2626'][piece % 4],
                        transform: `rotate(${piece * 17}deg)`
                      }}
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleCloseWheelModal}
                disabled={isWheelSpinning}
                className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-700 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="px-2 py-1 md:p-6">
                <div className="mx-auto mb-3 max-w-lg text-center md:mb-5">
                  <h2 className="text-base md:text-3xl font-black tracking-tight uppercase text-slate-950">
                    Gire e veja seu premio
                  </h2>
                </div>

                <div className="mx-auto flex w-full max-w-md flex-col items-center">
                  <div className="relative h-[272px] w-[272px] md:h-[368px] md:w-[368px]">
                      <div className="absolute left-1/2 top-1 z-20 h-0 w-0 -translate-x-1/2 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary drop-shadow-[0_8px_16px_rgba(37,99,235,0.25)]" />
                      <motion.div
                        animate={{ rotate: wheelRotation }}
                        transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-full border-[12px] border-white shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
                        style={{
                          background: 'conic-gradient(#0f172a 0deg 60deg, #2563eb 60deg 120deg, #dc2626 120deg 180deg, #0ea5e9 180deg 240deg, #f59e0b 240deg 300deg, #16a34a 300deg 360deg)'
                        }}
                      >
                        {wheelPrizes.map((prize, index) => {
                          const angle = (360 / wheelPrizes.length) * index + (180 / wheelPrizes.length);

                          return (
                            <div
                              key={prize.id}
                              className="absolute left-1/2 top-1/2 w-20 md:w-28 text-center"
                              style={{
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-98px) rotate(${-angle}deg)`
                              }}
                            >
                              <span className="block whitespace-pre-line text-[9px] md:text-[11px] leading-[1.05] font-black uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                                {prize.wheelDisplayLabel}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>

                      <div className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 md:h-28 md:w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-8 border-white bg-[#fffaf3] text-center shadow-xl">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                            {awardedPrize ? 'Premio' : 'Sua vez'}
                          </p>
                          <p className="mt-1 text-base md:text-lg font-black uppercase text-slate-950">
                            {awardedPrize ? (isPrizeExpired ? 'expirado' : 'resgatado') : 'girar'}
                          </p>
                        </div>
                      </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpinWheel}
                    disabled={isWheelSpinning || !!awardedPrize}
                    className="cta-pulse mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950/95 px-5 py-3 text-xs md:text-sm font-black uppercase tracking-[0.15em] text-white shadow-[0_14px_35px_rgba(15,23,42,0.2)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isWheelSpinning ? 'Girando...' : awardedPrize ? 'Premio Resgatado' : 'Girar Agora'}
                  </button>

                  {awardedPrize && (
                    <div className="mt-4 w-full rounded-[1.75rem] border border-white/60 bg-white/92 p-4 shadow-[0_24px_50px_rgba(15,23,42,0.18)] backdrop-blur-md md:p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Premio Confirmado
                      </p>
                      <h3 className="mt-2 text-xl md:text-2xl font-black tracking-tight text-slate-950">
                        {awardedPrize.resultTitle}
                      </h3>
                      <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-700">
                        {awardedPrize.resultMessage}
                      </p>
                      {awardedPrize.couponCode && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 shadow-sm">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                            Seu cupom
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-lg font-black uppercase tracking-[0.12em] text-slate-950 shadow-sm">
                              {awardedPrize.couponCode}
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyCoupon}
                              className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-slate-800"
                            >
                              {copiedCoupon === awardedPrize.couponCode ? 'Copiado' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                          {isPrizeExpired ? 'Prazo Encerrado' : 'Tempo para usar'}
                        </p>
                        <p className={`mt-1 text-2xl font-black tracking-tight ${isPrizeExpired ? 'text-red-600' : 'text-slate-950'}`}>
                          {isPrizeExpired ? 'EXPIRADO' : countdownLabel}
                        </p>
                      </div>

                      {isPrizeExpired ? (
                        <div className="mt-4 block w-full rounded-2xl bg-slate-300 px-5 py-4 text-center text-sm md:text-base font-black uppercase tracking-[0.12em] text-slate-500">
                          Premio expirado
                        </div>
                      ) : (
                        <a
                          href={awardedPrize.href}
                          className="mt-4 block w-full rounded-2xl bg-primary px-5 py-4 text-center text-sm md:text-base font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:scale-[1.01]"
                        >
                          {awardedPrize.ctaLabel}
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleCloseWheelModal}
                        className="mt-3 block w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-center text-sm md:text-base font-black uppercase tracking-[0.12em] text-slate-800 shadow-sm transition hover:bg-slate-100"
                      >
                        Continuar navegando
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {awardedPrize && showPrizeDock && !showWheelModal && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed inset-x-0 bottom-4 z-[215] px-4"
          >
            <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/95 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.2)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Premio Liberado
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                    {awardedPrize.resultTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleDismissPrizeDock}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {awardedPrize.couponCode && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base font-black uppercase tracking-[0.12em] text-slate-950">
                    {awardedPrize.couponCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
                  >
                    {copiedCoupon === awardedPrize.couponCode ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              )}

              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                    {isPrizeExpired ? 'Prazo Encerrado' : 'Tempo para usar'}
                  </p>
                  <p className={`mt-1 text-xl font-black tracking-tight ${isPrizeExpired ? 'text-red-600' : 'text-slate-950'}`}>
                    {isPrizeExpired ? 'EXPIRADO' : countdownLabel}
                  </p>
                </div>
                <a
                  href={awardedPrize.href}
                  className={`inline-flex min-w-[132px] items-center justify-center rounded-xl px-4 py-4 text-center text-xs font-black uppercase tracking-[0.12em] ${
                    isPrizeExpired
                      ? 'pointer-events-none bg-slate-300 text-slate-500'
                      : 'bg-primary text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)]'
                  }`}
                >
                  {isPrizeExpired ? 'Expirado' : 'Usar premio'}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgency Banner */}
      <div className="bg-primary py-2 px-4 text-center sticky top-0 z-[110]">
        <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center gap-2">
          <AlertCircle className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> 🚨 85% das vagas do APP já preenchidas! Aproveite agora! 🚨
        </p>
      </div>

      {/* Cinematic Hero */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-16 md:pt-32 pb-12 md:pb-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero.png" 
            alt="Construction Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6f1e8] via-[#f6f1e8]/35 to-[#f6f1e8]" />
          <div className="absolute inset-0 bg-[#f6f1e8]/55" />
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/15 blur-[180px] rounded-full opacity-60 pointer-events-none z-1" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:mb-8 text-[10px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-600 border border-slate-300 rounded-full bg-white/70">
              <Zap className="w-3 h-3 text-primary animate-pulse" /> Projetos 100% Editáveis em Revit
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter mb-4 md:mb-8 leading-[0.95] md:leading-[0.9] uppercase">
              Pack Com 500 Projetos Completos E Listas De Materiais Para Economizar 50% Na Obra
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base md:text-xl text-slate-700 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4 md:px-0">
              Elimine o desperdício e o retrabalho com plantas técnicas de arquitetura, elétrica e hidráulica prontas para o pedreiro.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4 md:px-0">
              <a href="#pricing" className="group relative w-full sm:w-auto bg-primary text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl text-lg md:text-xl font-black hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-xl">
                QUERO OS PROJETOS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://members-arqclub.vercel.app/" target="_blank" rel="noopener noreferrer" className="group relative w-full sm:w-auto bg-[#16a34a] text-white px-8 md:px-10 py-5 md:py-6 rounded-2xl text-base md:text-lg font-black hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl">
                ACESSAR PRÉVIA
              </a>
              <div className="text-center sm:text-left">
                <p className="text-[10px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Entrega via E-mail</p>
                <p className="text-xs md:text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Acesso Imediato
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section id="para-quem" className="py-12 md:py-24 bg-[#ece4d7]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-24">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-8 uppercase leading-tight">🏠 PARA QUEM É ESTA <span className="text-slate-500 text-2xl md:text-6xl block md:inline">COLEÇÃO?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {[
              { title: "Você que está saindo do aluguel", desc: "Já tem o terreno (ou vai ter) e quer começar certo, com orçamento claro e projeto profissional." },
              { title: "Você que quer economizar sem perder qualidade", desc: "Lista de materiais e simulador de custos eliminam desperdícios. Economize até 50%!" },
              { title: "Investidor que quer construir para alugar/vender", desc: "Variedade de metragens e plantas aprovadas para executar rápido e com menos risco." },
              { title: "Profissional de obras que não aceita retrabalho", desc: "Plantas técnicas, checklists e versão para canteiro que sua equipe consegue seguir." }
            ].map((item, i) => (
              <div key={i} className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] bg-white/80 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-8 group shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 tracking-tight">✅ {item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light text-base md:text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto text-center mt-10 md:mt-16">
            <p className="text-slate-800 font-black tracking-widest text-sm md:text-base uppercase">👉 Se você marcou 2 ou mais perfis, essa coleção foi feita pra você!</p>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Fachadas */}
      <section className="py-12 md:py-24 overflow-hidden bg-[#f6f1e8]">
        <div className="container mx-auto px-6 mb-8 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-black tracking-tight uppercase leading-tight">Uma parte dos projetos <br /><span className="text-slate-500 italic text-xl md:text-5xl">que vai receber👇🏻</span></h2>
        </div>
        
        <div className="flex flex-col gap-4 md:gap-10">
          <div className="flex whitespace-nowrap">
            <motion.div animate={{ x: [0, -1500] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              {[...fachadas, ...fachadas].map((img, i) => (
                <div key={i} className="w-[240px] md:w-[450px] aspect-video rounded-xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shrink-0">
                  <img src={img} alt={`Fachada ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex whitespace-nowrap">
            <motion.div animate={{ x: [-1500, 0] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              {[...fachadas.slice().reverse(), ...fachadas].map((img, i) => (
                <div key={i} className="w-[240px] md:w-[450px] aspect-video rounded-xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shrink-0">
                  <img src={img} alt={`Fachada Rev ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex whitespace-nowrap">
            <motion.div animate={{ x: [0, -1500] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              {[...fachadas.slice(10), ...fachadas.slice(0, 10)].map((img, i) => (
                <div key={i} className="w-[240px] md:w-[450px] aspect-video rounded-xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shrink-0">
                  <img src={img} alt={`Fachada Offset ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex whitespace-nowrap">
            <motion.div animate={{ x: [-1500, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              {[...fachadas.slice(20), ...fachadas.slice(0, 20)].map((img, i) => (
                <div key={i} className="w-[240px] md:w-[450px] aspect-video rounded-xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shrink-0">
                  <img src={img} alt={`Fachada Offset Rev ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="conquistas" className="py-12 md:py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-24">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-8 uppercase leading-tight">🎯 O QUE VOCÊ VAI <span className="text-slate-500 italic block md:inline">CONQUISTAR💸</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {[
              { icon: <DollarSign />, title: "Economia Real e Comprovada", desc: "Até 50% de redução nos custos com lista por etapa e zero desperdício." },
              { icon: <Layers />, title: "Projeto Técnico Completo", desc: "Arquitetônico + elétrica + hidráulica prontos. Zero necessidade de contratar separadamente." },
              { icon: <Award />, title: "Aprovação Mais Rápida", desc: "Documentos compatíveis com prefeituras reduzem atrasos burocráticos." },
              { icon: <Calculator />, title: "Controle Total do Orçamento", desc: "Simulador automático por região prevê gastos por fase. Sem surpresas!" },
              { icon: <Layout />, title: "Visualize Antes de Construir", desc: "Renderizações 3D para tomar decisões com confiança." },
              { icon: <Smartphone />, title: "PDF para o Canteiro", desc: "Versão simplificada que o pedreiro entende e consegue executar." }
            ].map((item, i) => (
              <div key={i} className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[40px] bg-white/80 border border-slate-200 text-center sm:text-left shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <div className="text-primary mb-6 md:mb-8 flex justify-center sm:justify-start">{React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-8 h-8 md:w-8 md:h-8" })}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 tracking-tight uppercase">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light text-base md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Showcase */}
      <section className="py-12 md:py-24 bg-[#f2ece2] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-24">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-4 md:mb-8 uppercase">🎁 Bônus <span className="text-slate-500 italic block md:inline">Exclusivos</span></h2>
            <p className="text-slate-600 text-base md:text-lg font-light">E não para por aí, você também leva:</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto">
            {[
              { id: 1, title: "Checklist Aprovação Prefeituras", value: "R$ 67.00" },
              { id: 2, title: "Planilha Automática de Orçamento", value: "R$ 47.00" },
              { id: 3, title: "Guia 15 Erros Caros em Obras", value: "R$ 49.00" },
              { id: 4, title: "PDF Modo Obra Simplificado", value: "R$ 37.00" },
              { id: 5, title: "Cronograma Realista de Obra", value: "R$ 99.00" }
            ].map((bonus, i) => (
              <div key={i} className="p-4 md:p-8 rounded-[1rem] md:rounded-[2.5rem] bg-white/85 border border-slate-200 text-center group shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                <p className="text-primary font-bold text-[10px] md:text-xs mb-2 uppercase tracking-widest">🎁 Bônus {bonus.id}</p>
                <h4 className="text-base md:text-xl font-bold mb-1 md:mb-4 tracking-tight leading-tight">{bonus.title}</h4>
                <p className="text-slate-400 line-through text-[10px] md:text-xs mb-0.5 md:mb-2">de {bonus.value} e você leva</p>
                <div className="text-primary font-black text-[10px] md:text-sm uppercase tracking-widest italic group-hover:scale-110 transition-transform">DE GRAÇA</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-24 bg-[#e9e1d4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-24">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-4 md:mb-8 uppercase leading-tight">SELECIONE <span className="text-slate-500 italic block md:inline">SEU PLANO</span></h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6">
              <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                <Smartphone className="w-4 h-4" /> Acesse do computador
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                <CheckCircle2 className="w-4 h-4" /> Acesso vitalício
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                <Zap className="w-4 h-4" /> Acesso imediato
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto items-stretch px-2 md:px-0">
            {/* Mega Pack Card */}
            <div className="bg-white/85 rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-200 flex flex-col overflow-hidden shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
              {isMegaCouponPrize && (
                <div className="mb-6 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Cupom liberado nesta tela
                  </p>
                  <h4 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    {awardedPrize?.resultTitle}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {awardedPrize?.resultMessage}
                  </p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                    {isPrizeExpired ? 'Prazo encerrado' : `Use em ate ${countdownLabel}`}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-start mb-8 md:mb-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-1 tracking-tighter italic">MEGA PACK</h3>
                  <p className="text-slate-600 text-[10px] md:text-[10px] font-black uppercase tracking-widest">Acesso Completo</p>
                </div>
              </div>
              
              <ul className="space-y-3 md:space-y-4 mb-10 md:mb-12 flex-grow">
                {[
                  "100+ Projetos Completos (Editáveis em REVIT e DWG) - R$ 297",
                  "Renderizações 3D de Todos os Projetos - R$ 60",
                  "Lista Completa de Materiais por Projeto - R$ 28",
                  "Planilha PRO de Custos + Cronograma - R$ 97",
                  "PDFs Otimizados \"Modo Obra\" - R$ 20",
                  "Guia Prático de Construção - R$ 15",
                  "🎁 BÔNUS 1 — Checklist Aprovação Prefeituras - R$ 97",
                  "🎁 BÔNUS 2 — Planilha Automática de Orçamento - R$ 67",
                  "🎁 BÔNUS 3 — Guia 15 Erros Caros em Obras - R$ 47",
                  "🎁 BÔNUS 4 — Cronograma Realista de Obra - R$ 67",
                  "🎁 BÔNUS 5 — PDF Modo Obra Simplificado - R$ 28",
                  "🎁 BÔNUS 6 — Grupo VIP WhatsApp - R$ 67"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 md:gap-4 text-slate-700 text-[10px] md:text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 md:w-4 h-4 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-8 md:pt-10 border-t border-slate-200">
                <div className="mb-6 md:mb-8 text-center sm:text-left">
                  <p className="text-slate-400 line-through font-bold text-base md:text-lg mb-1 tracking-tighter">VALOR TOTAL: R$ 890,00</p>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 md:gap-3">
                    <span className="text-4xl md:text-5xl font-black tracking-tighter">R$ 37,90</span>
                    <span className="text-primary font-black text-[10px] md:text-xs uppercase tracking-widest italic">Ou 6x R$ 7,24</span>
                  </div>
                </div>
                <a 
                  href="https://payfast.greenn.com.br/mx6qdv5/offer/n2h1Gy?ch_id=143967&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term="
                  className="block text-center w-full bg-slate-950 border border-slate-950 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-lg hover:bg-slate-800 transition-all"
                >
                  GARANTIR MEGA PACK
                </a>
              </div>
            </div>

            {/* Ultra Pack Card */}
            <div className="relative group h-full">
              <div className="absolute -inset-[2px] bg-gradient-to-br from-primary to-blue-500 rounded-[2rem] md:rounded-[4rem] blur-sm opacity-20 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-[#fffaf3] rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 border border-primary/20 h-full flex flex-col overflow-hidden shadow-[0_22px_60px_rgba(0,86,179,0.12)]">
                {isUltraDiscountPrize && (
                  <div className="mb-6 rounded-[1.5rem] border border-amber-300 bg-amber-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                      Premio ativo nesta tela
                    </p>
                    <h4 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      {awardedPrize?.resultTitle}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {awardedPrize?.resultMessage}
                    </p>
                    <p className="mt-3 text-[11px] font-black uppercase tracking-[0.16em] text-amber-700">
                      {isPrizeExpired ? 'Prazo encerrado' : `Garanta em ate ${countdownLabel}`}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-start mb-8 md:mb-10">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black mb-1 tracking-tighter italic">ULTRA PACK</h3>
                    <p className="text-slate-600 text-[10px] md:text-[10px] font-black uppercase tracking-widest">A solução definitiva</p>
                  </div>
                  <div className="px-4 md:px-5 py-1.5 md:py-2 bg-primary text-white text-[10px] md:text-[10px] font-black uppercase tracking-widest rounded-full">Melhor Escolha</div>
                </div>

                <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <p className="text-primary font-black text-xs uppercase tracking-widest mb-3">Tudo que contém no Mega Pack, mais:</p>
                  <ul className="space-y-3">
                    {[
                      "500 Projetos em PDF/Planta Humanizada para inspiração",
                      "35 Projetos de casas de campo (Editáveis em DWG)",
                      "100 Projetos de Chalé Alpino (Projetos para lucrar no AirBNB)"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-900 text-[11px] md:text-xs font-bold leading-tight">
                        <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <ul className="space-y-3 md:space-y-4 mb-10 md:mb-12 flex-grow">
                  {[
                    "100+ Projetos Completos (Editáveis em REVIT e DWG)",
                    "Renderizações 3D de Todos os Projetos",
                    "Lista Completa de Materiais por Projeto",
                    "Planilha PRO de Custos + Cronograma",
                    "Acesso Vitalício + Todos os Bônus VIP"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 md:gap-4 text-slate-700 text-[10px] md:text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 md:w-4 h-4 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto pt-8 md:pt-10 border-t border-slate-200">
                  <div className="mb-6 md:mb-8 text-center sm:text-left">
                    <p className="text-slate-400 line-through font-bold text-lg md:text-xl mb-1 tracking-tighter">VALOR TOTAL: R$ 1.290,00</p>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2 md:gap-3">
                      <span className="text-5xl md:text-6xl font-black tracking-tighter">R$ 67,00</span>
                      <span className="text-primary font-black text-[10px] md:text-sm uppercase tracking-widest italic">Ou 12x R$ 6,70</span>
                    </div>
                  </div>
                  <a 
                    href="https://payfast.greenn.com.br/fer3kv5/offer/dXBDLA?ch_id=143967&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term="
                  className="block text-center w-full bg-primary text-white py-5 md:py-7 rounded-2xl md:rounded-3xl font-black text-xl md:text-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    GARANTIR ULTRA PACK
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-24 bg-[#f3ede3]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 uppercase">Dúvidas <span className="text-slate-500 italic block md:inline">Frequentes:</span></h2>
            <p className="text-slate-600 text-sm md:text-base font-medium uppercase tracking-widest">Aqui estão as dúvidas mais frequentes:</p>
          </div>
          <div className="space-y-2 md:space-y-4">
            {[
              { question: "Estes projetos funcionam em qual versão de Revit?", answer: "A partir do Revit 2020 e todas posteriores (2021, 2022…2026)" },
              { question: "Para quem é este template?", answer: "Para pessoas que querem sair do aluguel construindo com economia, investidores imobiliários e profissionais da construção que buscam agilidade e precisão técnica." },
              { question: "Posso modificar livremente os projetos?", answer: "Sim! Todos os projetos são 100% editáveis em Revit, permitindo que você ou seu profissional façam qualquer ajuste necessário para o seu terreno ou preferência." },
              { question: "Como recebo o acesso ao pack?", answer: "O acesso é imediato e enviado para o e-mail cadastrado no momento da compra. Você receberá um link para download de todos os arquivos e bônus." },
              { question: "E se eu não gostar do projeto?", answer: "Você tem garantia incondicional de 07 dias. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu investimento sem perguntas." }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-slate-200">
                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full py-5 md:py-8 flex items-center justify-between text-left group gap-4">
                  <span className="text-base md:text-lg font-bold text-slate-700 group-hover:text-slate-950 transition-colors tracking-tight leading-tight">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 md:w-5 md:h-5 shrink-0 text-slate-500 transition-transform duration-500 ${activeFaq === idx ? 'rotate-180 text-slate-950' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-5 md:pb-8 text-slate-600 leading-relaxed font-light text-sm md:text-lg">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Guarantee */}
      <section className="py-12 md:py-24 bg-[#fffaf3] text-slate-950 text-center px-6">
        <div className="container mx-auto max-w-4xl">
          <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-6 md:mb-10" />
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4 md:mb-8 leading-tight uppercase">RISCO ZERO. GARANTIA DE 07 DIAS.</h2>
          <p className="text-base md:text-xl font-medium leading-relaxed text-slate-600">
            Se você não economizar 100 horas de trabalho, devolvemos seu dinheiro. E você AINDA FICA com os Bônus! Obtenha acesso assim que o pagamento for confirmado.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-slate-200 bg-[#f6f1e8]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded-sm" />
            </div>
            <span className="text-sm md:text-base font-bold tracking-tight uppercase">CONSTRUTOR<span className="text-slate-500 italic">EXPRESS</span></span>
          </div>
          <div className="text-slate-500 text-[9px] md:text-[10px] font-medium uppercase tracking-widest">© 2025 CONSTRUTOR EXPRESS. TODOS OS DIREITOS RESERVADOS. <br className="md:hidden" /> Política de Privacidade | Termos de Uso</div>
          <div className="flex gap-6 md:gap-8 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-slate-950 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Termos</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp - Floating */}
      {isPricingInView && (
        <a href="https://wa.me/5511978693918" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[110] bg-[#25D366] text-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        </a>
      )}
    </div>
  );
};

export default App;
