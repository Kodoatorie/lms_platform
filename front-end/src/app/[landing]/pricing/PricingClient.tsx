'use client';

import { useState } from 'react';
import { getDictionary } from '../../../i18n/dictionaries';
import { Check, ChevronDown } from 'lucide-react';

export default function PricingClient({ locale }: { locale: string }) {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 relative overflow-hidden py-24">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <main className="z-10 w-full max-w-6xl px-4 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            {t.seo.pricing.title.split('—')[0].trim()}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t.seo.pricing.description}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="relative flex items-center p-1 bg-slate-200/60 rounded-full border border-slate-200">
            <div
              className={`absolute h-[calc(100%-8px)] rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${
                isYearly ? 'left-[calc(50%+4px)] w-[calc(50%-8px)]' : 'left-1 w-[calc(50%-8px)]'
              }`}
            />
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 px-6 py-2.5 text-sm font-medium transition-colors ${
                !isYearly ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.pricing.toggleMonthly}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 px-6 py-2.5 text-sm font-medium transition-colors ${
                isYearly ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.pricing.toggleYearly}
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-8">
          {t.pricing.plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                'highlight' in plan && plan.highlight
                  ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'border border-slate-200/60 shadow-sm'
              }`}
            >
              {'highlight' in plan && plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{plan.name}</h3>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price === 'Индивидуально' || plan.price === 'Custom' || plan.price === 'Жеке' ? plan.price : `${plan.price} ₸`}
                </span>
                {(plan.price !== 'Индивидуально' && plan.price !== 'Custom' && plan.price !== 'Жеке') && (
                  <span className="text-slate-500">/мес</span>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  'highlight' in plan && plan.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Выбрать тариф
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto pt-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">{t.pricing.faqTitle}</h2>
          <div className="space-y-4">
            {t.pricing.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
