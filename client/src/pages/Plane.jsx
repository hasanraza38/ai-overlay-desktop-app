import { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <Star className="w-6 h-6" />,
      monthlyPrice: 9,
      annualPrice: 7,
      color: 'from-blue-500 to-purple-600',
      borderColor: 'border-blue-200',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Email support',
        '2GB storage'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Zap className="w-6 h-6" />,
      monthlyPrice: 29,
      annualPrice: 24,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-300',
      popular: true,
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        '50GB storage',
        'Team collaboration'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: <Crown className="w-6 h-6" />,
      monthlyPrice: 99,
      annualPrice: 79,
      color: 'from-pink-600 to-red-600',
      borderColor: 'border-pink-200',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'Unlimited storage',
        'Advanced security',
        'Custom branding'
      ]
    }
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
      <div className=" min-h-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/25">
            <div className="w-8 h-8 bg-white rounded-lg opacity-90"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-gray-300 text-sm">Unlock powerful features for your workflow</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-700">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${!isAnnual
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 relative ${isAnnual
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Annual
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                20% off
              </span>
            </button>
          </div>
        </div>
        {/* <div className='flex'> */}
          {/* Pricing Cards */}
          <div className="flex space-x-4">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 hover:scale-105 hover:bg-white/15 cursor-pointer ${plan.popular ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/25' : 'border-gray-700'
                  } ${selectedPlan === plan.id ? 'ring-2 ring-blue-400 bg-white/15' : ''
                  }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${plan.color} text-white shadow-lg`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-400 text-sm">/mo</span>
                    </div>
                    {isAnnual && (
                      <div className="text-xs text-green-400 line-through">
                        ${plan.monthlyPrice}/mo
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${selectedPlan === plan.id
                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                    : 'bg-white/10 text-white hover:bg-white/20 border border-gray-600'
                    }`}
                >
                  {selectedPlan === plan.id ? 'Selected Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        {/* </div> */}
        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Ready to get started?</h3>
            <p className="text-purple-100 text-sm mb-4">
              Join thousands of users already using our platform
            </p>
            <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}