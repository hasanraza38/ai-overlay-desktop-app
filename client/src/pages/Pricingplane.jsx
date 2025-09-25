import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Topbar from '../components/Topbar';
import { api } from '../Instance/api';

const CheckoutPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(0);
    const [purchasedPlan, setPurchasedPlan] = useState(0);

    // Optional default plans (fallback)
    const defaultPlans = [
        {
            id: 0,
            avatars: 'Free',
            variations: 'Basic Plan',
            price: 0.00,
            benefits: [
                'Limited AI queries per day (e.g., 20 queries/day)',
                'Basic avatars / themes',
                'Limited export/download options'
            ]
        },
        {
            id: 1,
            avatars: 'Pro',
            variations: 'Standard Plan',
            price: 5.99,
            popular: true,
            benefits: [
                'Unlimited AI queries',
                'Extra avatars / themes',
                'Export conversations',
                'Priority support'
            ]
        },
        {
            id: 2,
            avatars: 'Premium',
            variations: 'Advanced Plan',
            price: 7.99,
            benefits: [
                'All Pro features +',
                'Custom AI prompts',
                'Team / multi-user support',
                'Early access to new features',
            ]
        }
    ];

    // Fetch plans
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('plans'); // Backend /plans endpoint
                console.log("Plans API response:", response.data);
                setPlans(response.data || defaultPlans);
            } catch (error) {
                console.error('Error fetching pricing plans:', error.response?.data || error.message || error);
                setPlans(defaultPlans);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Handle purchase
    const handlePurchase = async () => {
        const plan = plans[selectedPlan];
        if (!plan) return;

        try {
            const response = await api.post('payment/checkout', {
                amount: plan.price * 100, // Safepay expects amount in smallest currency unit
                orderId: `SUB-${Date.now()}`,
                cancelUrl: 'https://www.google.com/',
                redirectUrl: 'http://localhost:4000/success'
            });

            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Safepay checkout
            }

            setPurchasedPlan(selectedPlan);
        } catch (error) {
            console.error('Payment error:', error.response?.data || error);
            alert('Payment failed. Try again!');
        }
    };

    if (loading) {
        return <div className="text-white text-center mt-20">Loading plans...</div>;
    }

    return (
        <div className="bg-black text-white min-h-screen max-w-sm mx-auto relative overflow-hidden">
            <Topbar />
            <div className="px-6 pb-8 mt-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                    Boost Your Productivity with AI
                </h1>

                <div className="space-y-6 mb-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={plan.id || idx}
                            onClick={() => setSelectedPlan(idx)}
                            className={`relative bg-gray-800 rounded-[12px] p-4 cursor-pointer transition-all duration-200 ${selectedPlan === idx ? 'bg-gray-700 ring-2 ring-purple-500' : 'hover:bg-gray-700'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-purple-600 text-white px-3 py-1 rounded-[12px] text-xs font-semibold">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-6 h-6 rounded-[12px] border-2 flex items-center justify-center ${selectedPlan === idx ? 'bg-purple-600 border-purple-500' : 'border-gray-500'}`}>
                                        {selectedPlan === idx && <Check className="w-4 h-4 text-black" />}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{plan.avatars}</div>
                                        <div className="text-gray-400 text-sm">{plan.variations}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold text-lg">{plan.price}</div>
                                </div>
                            </div>

                            {selectedPlan === idx && (
                                <div className="mt-1 bg-gray-900 rounded-[10px] p-3 space-y-2 transition-all duration-300">
                                    {plan.benefits.map((benefit, i) => (
                                        <div key={i} className="text-gray-300 text-sm flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-purple-500" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={purchasedPlan === selectedPlan ? null : handlePurchase}
                    className={`w-full font-semibold py-4 rounded-lg text-lg mt-2 transition-colors duration-200 focus:ring-opacity-50 cursor-pointer ${purchasedPlan === selectedPlan ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                    {purchasedPlan === selectedPlan ? 'Your Current Plan' : `Buy ${plans[selectedPlan]?.avatars}`}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
