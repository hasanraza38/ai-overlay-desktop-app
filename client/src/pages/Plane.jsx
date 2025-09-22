// import React, { useState } from 'react';
// import { Check } from 'lucide-react';
// import Topbar from '../components/Topbar';

// const CheckoutPage = () => {
//   const [selectedPlan, setSelectedPlan] = useState(0); // Default to Free
//   const [purchasedPlan, setPurchasedPlan] = useState(0); // Free plan is current plan

//   const plans = [
//     {
//       id: 0,
//       avatars: 'Free',
//       variations: 'Basic Plan',
//       price: '$0.00',
//       benefits: [
//         'Limited AI queries per day (e.g., 20 queries/day)',
//         'Basic avatars / themes',
//         'Limited export/download options'
//       ]
//     },
//     {
//       id: 1,
//       avatars: 'Pro',
//       variations: 'Standard Plan',
//       price: '$5.99',
//       popular: true,
//       benefits: [
//         'Unlimited AI queries',
//         'Extra avatars / themes',
//         'Export conversations',
//         'Priority support'
//       ]
//     },
//     {
//       id: 2,
//       avatars: 'Premium',
//       variations: 'Advanced Plan',
//       price: '$7.99',
//       benefits: [
//         'All Pro features +',
//         'Custom AI prompts',
//         'Team / multi-user support',
//         'Early access to new features',
//       ]
//     }
//   ];

//   const handlePurchase = () => {
//     // Update purchased plan to selected
//     setPurchasedPlan(selectedPlan);
//     alert(`You have purchased the ${plans[selectedPlan].avatars} plan!`);
//   };

//   return (
//     <div className="bg-black text-white min-h-screen max-w-sm mx-auto relative overflow-hidden">
//       <Topbar />

//       <div className="px-6 pb-8 border border-amber-400">
//         <h1 className="text-3xl font-bold text-center mb-4">Boost Your Productivity with AI</h1>

//         <div className="space-y-6 mb-6 border border-amber-700">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               onClick={() => setSelectedPlan(plan.id)}
//               className={`relative bg-gray-800 rounded-[12px] p-4 cursor-pointer transition-all duration-200 ${selectedPlan === plan.id
//                   ? 'bg-gray-700 ring-2 ring-purple-500'
//                   : 'hover:bg-gray-700'
//                 }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
//                   <span className="bg-purple-600 text-white px-3 py-1 rounded-[12px] text-xs font-semibold">
//                     MOST POPULAR
//                   </span>
//                 </div>
//               )}

//               <div className="flex items-center justify-between border border-b-blue-900" >
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-6 h-6 rounded-[12px] border-2 flex items-center justify-center ${selectedPlan === plan.id
//                       ? 'bg-purple-600 border-purple-500'
//                       : 'border-gray-500'
//                     }`}>
//                     {selectedPlan === plan.id && <Check className="w-4 h-4 text-black" />}
//                   </div>

//                   <div>
//                     <div className="text-white font-medium">{plan.avatars}</div>
//                     <div className="text-gray-400 text-sm">{plan.variations}</div>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className="text-white font-bold text-lg">{plan.price}</div>
//                 </div>
//               </div>

//               {selectedPlan === plan.id && (
//                 <div className="mt-4 bg-gray-900 rounded-[10px] p-3 space-y-2 transition-all duration-300">
//                   {plan.benefits.map((benefit, idx) => (
//                     <div key={idx} className="text-gray-300 text-sm flex items-center space-x-2">
//                       <Check className="w-4 h-4 text-purple-500" />
//                       <span>{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={purchasedPlan === selectedPlan ? null : handlePurchase} // Disable click if current plan
//           className={`w-full font-bold py-4 rounded-[12px] text-lg mt-3.5 transition-colors duration-200 ${purchasedPlan === selectedPlan
//               ? 'bg-gray-600 text-gray-300 cursor-not-allowed' // Disabled style
//               : 'bg-purple-600 hover:bg-purple-700 text-white'
//             }`}
//         >
//           {purchasedPlan === selectedPlan ? 'Your Current Plan' : `Buy ${plans[selectedPlan].avatars}`}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
