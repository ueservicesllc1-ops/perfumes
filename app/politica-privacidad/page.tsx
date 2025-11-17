'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { privacyPolicyTranslations } from '@/lib/translations/privacy-policy'

export default function PoliticaPrivacidad() {
  const { language } = useLanguage()
  const { currentTheme } = useTheme()
  const content = privacyPolicyTranslations[language]

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, paddingTop: '60px', paddingBottom: '80px' }}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: currentTheme.colors.accent }}
          >
            {content.title}
          </h1>

          <div 
            className="p-6 rounded-lg space-y-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <section className="space-y-3">
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.intro}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.cookiesIntro}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section1.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section1.text}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section1.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section2.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text2}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text3}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text4}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text5}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text6}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section2.text7}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section3.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.text2}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.text3}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.text4}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section3.text5}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section4.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section4.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section4.text2}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section4.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section4.text3}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section5.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section5.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section5.text2}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section5.text3}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section5.text4}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section6.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section6.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section6.text2}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section6.text3}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section6.text4}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section7.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section7.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section7.text2}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section8.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section8.text1}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section8.text2}
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section8.text3}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section9.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section9.text}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.section10.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.section10.text}
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

