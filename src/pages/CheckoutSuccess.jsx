import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const translations = {
  en: {
    title: "Payment Successful!",
    subtitle: "Thank you for your purchase. Your hosting service is being provisioned.",
    whatsNext: "What's Next?",
    step1: "Check your email",
    step1Desc: "for account credentials and welcome instructions",
    step2: "Automatic provisioning",
    step2Desc: "Your hosting service will be ready within 5-10 minutes",
    step3: "Access your control panel",
    step3Desc: "to manage domains, email, databases, and more",
    ctaPanel: "Go to Control Panel",
    ctaHome: "Return to Home",
    language: "Language"
  },
  es: {
    title: "¡Pago Exitoso!",
    subtitle: "Gracias por su compra. Su servicio de hosting está siendo aprovisionado.",
    whatsNext: "¿Qué Sigue?",
    step1: "Revisa tu correo",
    step1Desc: "para credenciales de cuenta e instrucciones de bienvenida",
    step2: "Aprovisionamiento automático",
    step2Desc: "Su servicio de hosting estará listo en 5-10 minutos",
    step3: "Accede a tu panel de control",
    step3Desc: "para gestionar dominios, correo, bases de datos y más",
    ctaPanel: "Ir al Panel de Control",
    ctaHome: "Volver al Inicio",
    language: "Idioma"
  },
  fr: {
    title: "Paiement Réussi!",
    subtitle: "Merci pour votre achat. Votre service d'hébergement est en cours de provisionnement.",
    whatsNext: "Et Maintenant?",
    step1: "Vérifiez votre email",
    step1Desc: "pour les identifiants de compte et les instructions de bienvenue",
    step2: "Provisionnement automatique",
    step2Desc: "Votre service d'hébergement sera prêt dans 5-10 minutes",
    step3: "Accédez à votre panneau de contrôle",
    step3Desc: "pour gérer les domaines, les emails, les bases de données et plus",
    ctaPanel: "Aller au Panneau de Contrôle",
    ctaHome: "Retour à l'Accueil",
    language: "Langue"
  },
  ht: {
    title: "Peman Siksè!",
    subtitle: "Mèsi pou acha ou. Sèvis hosting ou ap prepare.",
    whatsNext: "Kisa ki Pral Rive Aprè?",
    step1: "Tcheke imèl ou",
    step1Desc: "pou jwenn enfòmasyon kont ou ak enstriksyon byenveni",
    step2: "Preparasyon otomatik",
    step2Desc: "Sèvis hosting ou ap pare nan 5-10 minit",
    step3: "Antre nan panèl kontwòl ou",
    step3Desc: "pou jere domèn, imèl, baz done, epi plis ankò",
    ctaPanel: "Al nan Panèl Kontwòl",
    ctaHome: "Retounen Lakay",
    language: "Lang"
  }
};

export default function CheckoutSuccess() {
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ht', name: 'Kreyòl', flag: '🇭🇹' }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        <Helmet>
          <title>Payment Successful — MigraHosting</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <main className="mx-auto max-w-4xl px-4 py-20">
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl animate-bounce">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* What's Next Section */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
              <span className="text-3xl">✨</span>
              {t.whatsNext}
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start group hover:bg-white/5 rounded-xl p-4 transition-all">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6A5CFF] to-[#8A4DFF] text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{t.step1}</h3>
                  <p className="text-white/70">{t.step1Desc}</p>
                </div>
                <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start group hover:bg-white/5 rounded-xl p-4 transition-all">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8A4DFF] to-[#C04BFF] text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{t.step2}</h3>
                  <p className="text-white/70">{t.step2Desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-sm text-yellow-400">In Progress</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start group hover:bg-white/5 rounded-xl p-4 transition-all">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C04BFF] to-[#FF6584] text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{t.step3}</h3>
                  <p className="text-white/70">{t.step3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/client-portal"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-bold text-lg shadow-lg shadow-[#8A4DFF]/50 transition-all hover:scale-105 hover:shadow-xl"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t.ctaPanel}
            </Link>
            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-xl px-8 font-bold text-lg transition-all hover:scale-105 hover:border-[#8A4DFF] hover:bg-white/10"
            >
              {t.ctaHome}
            </Link>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
              <div className="text-sm text-white/60 mb-3 text-center">{t.language}</div>
              <div className="flex gap-2 flex-wrap justify-center">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all hover:scale-105 ${
                      language === lang.code
                        ? 'bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white shadow-lg'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              Need help?{' '}
              <a href="mailto:support@migrahosting.com" className="text-[#8A4DFF] hover:underline font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
