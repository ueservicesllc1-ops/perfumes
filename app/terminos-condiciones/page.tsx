'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTheme } from '@/contexts/ThemeContext'

export default function TerminosCondiciones() {
  const { currentTheme } = useTheme()
  
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
            Términos y Condiciones
          </h1>

          <div 
            className="p-6 rounded-lg space-y-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Introduction
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                This website uses cookies. By using this website and agreeing to these terms and conditions, you consent to American Seaair Import's use of cookies in accordance with the terms of American Seaair Import's privacy policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                License to use website
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Unless otherwise stated, American Seair Import and/or its licensors own the intellectual property rights in the website and material on American Seair Import. Subject to the license below, all these intellectual property rights are reserved.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You may view; download for caching purposes only, and print pages, or other content from Fragrance Wholesaler USA for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.
              </p>
              <div style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <p className="font-semibold mb-2">You must not:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>republish material from this website (including republication on another website);</li>
                  <li>sell, rent or sub-license material from the website;</li>
                  <li>show any material from the website in public;</li>
                  <li>reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose;</li>
                  <li>edit or otherwise modify any material on the website; or</li>
                  <li>redistribute material from this website except for content specifically and expressly made available for redistribution.</li>
                </ul>
              </div>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Where content is specifically made available for redistribution, it may only be redistributed within your organization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Acceptable use
              </h2>
              <div style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <p className="mb-2">You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of American Seair Import's or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
                <p className="mb-2">You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</p>
                <p className="mb-2">You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without American Seaair Import's express written consent.</p>
                <p className="mb-2">You must not use this website to transmit or send unsolicited commercial communications.</p>
                <p>You must not use this website for any purposes related to marketing without American Seaair Import's express written consent.</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Restricted access
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Access to certain areas of this website is restricted. American Seair Imports reserves the right to restrict access to certain areas of this website, or indeed this entire website, at American Seair Imports' discretion.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                If American Seair Import's provides you with a user ID and password to enable you to access restricted areas of this website or other content or services, you must ensure that the user ID and password are kept confidential.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seaair Imports may disable your user ID and password in Fragrance Wholesaler USA's sole discretion without notice or explanation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                User content
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                In these terms and conditions, "your user content" means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You grant to American Seair Import's a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media. You also grant to American Seair Import the right to sub-license these rights, and the right to bring an action for infringement of these rights.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Your user content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action, whether against you or American Seair Imports or a third party (in each case under any applicable law).
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You must not submit any user content to American Seair Imports that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaint.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seair Imports reserves the right to edit or remove any material submitted to this website, or stored on American Seair Import's servers, or hosted or published upon this website.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seair Imports reserves the rights under these terms and conditions in relation to user content. American Seair Imports does not undertake to monitor the submission of such content to, or the publication of such content on, this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                No warranties
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                This website is provided "as is" without any representations or warranties, express or implied. American Seair Imports makes no representations or warranties in relation to this website or the information and materials provided on this website.
              </p>
              <div style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <p className="mb-2">Without prejudice to the generality of the foregoing paragraph, Fragrance Wholesaler USA does not warrant that:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>this website will be constantly available, or available at all; or</li>
                  <li>the information on this website is complete, true, accurate or non-misleading.</li>
                </ul>
              </div>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Nothing on this website constitutes, or is meant to constitute, advice of any kind. If you require advice in relation to any legal, financial or medical matter you should consult an appropriate professional.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Limitations of liability
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seair Imports will not be liable to you (whether under the law of contract, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <li>to the extent that the website is provided free-of-charge, for any direct loss;</li>
                <li>for any indirect, special or consequential loss; or</li>
                <li>for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.</li>
              </ul>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                These limitations of liability apply even if American Seaair Imports has been expressly advised of the potential loss.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Exceptions
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Nothing in these terms and conditions will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit; and nothing in the terms and conditions will exclude or limit American Seair Import's liability in respect of any:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#F8F5EF', lineHeight: '1.8', fontSize: '14px' }}>
                <li>death or personal injury caused by American Seaair Imports' negligence;</li>
                <li>fraud or fraudulent misrepresentation on the part of American Seaair Imports or</li>
                <li>matter which it would be illegal or unlawful for Fragrance Wholesaler USA to exclude or limit, or to attempt or purport to exclude or limit, its liability.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Reasonableness
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                By using this website, you agree that the exclusions and limitations of liability set out in these terms and conditions are reasonable.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                If you do not think they are reasonable, you must not use this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Other parties
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You accept that, as a limited liability entity, American Seair Imports has an interest in limiting the personal liability of its officers and employees. You agree that you will not bring any claim personally against American Seaair Imports' officers or employees in respect of any losses you suffer in connection with the website.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect American Seaair Import's officers, employees, agents, subsidiaries, successors, assigns, and sub-contractors.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Unenforceable provisions
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Indemnity
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You hereby indemnify American Seair Imports and undertake to keep American Seaair Import's indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by American Seair Imports to a third party in settlement of a claim or dispute on the advice of American Seair Import's legal advisers) incurred or suffered by American Seair Import's arising out of any breach by you of any provision of these terms and conditions, or arising out of any claim that you have breached any provision of these terms and conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Breaches of these terms and conditions
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                Without prejudice to American Seair Import's other rights under these terms and conditions, if you breach these terms and conditions in any way, American Seair Imports may take such action as American Seair Import's deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Variation
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seair Imports may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the use of this website from the date of the publication of the revised terms and conditions on this website. Please check this page regularly to ensure you are familiar with the current version.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Assignment
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                American Seair Imports may transfer, sub-contract, or otherwise deal with American Seair Import's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.
              </p>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                You may not transfer, sub-contract, or otherwise deal with your rights and/or obligations under these terms and conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Severability
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Entire agreement
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                These terms and conditions, together with American Seair Imports' Privacy Policy constitute the entire agreement between you and American Seaair Imports in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
                Law and jurisdiction
              </h2>
              <p style={{ color: currentTheme.colors.text, lineHeight: '1.8', fontSize: '14px' }}>
                These terms and conditions will be governed by and construed in accordance with the laws of New York, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of New York State.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

