'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { refundPolicyTranslations } from '@/lib/translations/refund-policy'

export default function PolizaDevolucion() {
  const { language } = useLanguage()
  const { currentTheme } = useTheme()
  const content = refundPolicyTranslations[language]

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
            {/* Introducción */}
            <section className="space-y-3">
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.intro}
              </p>
            </section>

            {/* Requisitos */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.requirements.title}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.requirements.item1.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.requirements.item1.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.requirements.item2.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.requirements.item2.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.requirements.item3.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.requirements.item3.text}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2" style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                    <li>{content.requirements.item3.option1}</li>
                    <li>{content.requirements.item3.option2}</li>
                  </ul>
                  <p style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px', marginTop: '8px' }}>
                    {content.requirements.item3.note}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.requirements.item4.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.requirements.item4.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.requirements.item5.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.requirements.item5.text}
                  </p>
                </div>
              </div>
            </section>

            {/* Instrucciones */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.instructions.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.instructions.intro}
              </p>
              <ol className="list-decimal list-inside space-y-3 ml-4" style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <li>{content.instructions.step1}</li>
                <li>{content.instructions.step2}</li>
                <li>{content.instructions.step3}</li>
                <li>{content.instructions.step4}</li>
              </ol>
              <p style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px', marginTop: '16px' }}>
                {content.instructions.contact}
              </p>
            </section>

            {/* Acuerdo de Compra */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                {content.purchaseAgreement.title}
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                {content.purchaseAgreement.intro}
              </p>

              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.purchaseAgreement.availability.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.purchaseAgreement.availability.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.purchaseAgreement.shipping.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.purchaseAgreement.shipping.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.purchaseAgreement.returns.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.purchaseAgreement.returns.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.purchaseAgreement.endUsers.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.purchaseAgreement.endUsers.text}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {content.purchaseAgreement.liability.title}
                  </h3>
                  <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                    {content.purchaseAgreement.liability.text}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

