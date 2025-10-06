import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';
import { api } from '../Instance/api';
import log from 'electronmon/src/log';

const Pricingplan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(0);
    const [purchasedPlan, setPurchasedPlan] = useState(null);
    const [userPlan, setUserPlan] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => navigate("/settings");

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
            price: 1000,
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
            price: 2000,
            benefits: [
                'All Pro features +',
                'Custom AI prompts',
                'Team / multi-user support',
                'Early access to new features',
            ]
        }
    ];

    const planNameToIndex = {
        'free': 0,
        'pro': 1,
        'premium': 2
    };

    useEffect(() => {
        const fetchUserAndPlans = async () => {
            try {
                const userResponse = await api.get('dashboard/user');
                console.log("User API response:", userResponse.data);

                if (userResponse.data.success) {
                    const userPlanName = userResponse.data.data.plan.toLowerCase();
                    setUserPlan(userPlanName);
                    setPurchasedPlan(planNameToIndex[userPlanName]);
                    setSelectedPlan(planNameToIndex[userPlanName]);
                }

                const plansResponse = await api.get('plans');
                console.log("Plans API response:", plansResponse.data);
                setPlans(plansResponse.data || defaultPlans);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message || error);
                setPlans(defaultPlans);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndPlans();
    }, []);

    const handlePurchase = async () => {
        const plan = plans[selectedPlan];
        if (!plan) return;

        if (purchasedPlan === selectedPlan) {
            alert("You are already on this plan!");
            return;
        }

        try {
            const response = await api.post("payment/checkout", {
                amount: plan.price,
                orderId: `SUB-${Date.now()}`,
            });

            if (response.data.url) {
                if (window?.electronAPI?.openExt) {
                    window.electronAPI.openExt(response.data.url);
                } else {
                    console.error("electronAPI not available, fallback to window.open");
                    window.open(response.data.url, "_blank");
                }
            }

            setPurchasedPlan(selectedPlan);
        } catch (error) {
            console.error("Payment error:", error.response?.data || error);
            alert("Payment failed. Try again!");
        }
    };



    if (loading) {
        return <div className="text-white text-center mt-20">Loading plans...</div>;
    }

    return (
        <div className="bg-black text-white min-h-screen mx-auto relative overflow-hidden">
            <Topbar />

            <div className="px-6 pb-8 mt-3">
                <div className="mb-8">
                    <div className="flex items-start">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm text-gray-300 group-hover:text-white">Back</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 leading-tight">
                            Boost Your Productivity
                            <br />
                            <span className="text-xl text-gray-300 font-normal">with AI Power</span>
                        </h1>
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={plan.id || idx}
                            onClick={() => setSelectedPlan(idx)}
                            className={`relative bg-gray-800 rounded-[12px] p-4 cursor-pointer transition-all duration-200 ${selectedPlan === idx ? 'bg-gray-700 ring-2 ring-purple-500' : 'hover:bg-gray-700'
                                } ${purchasedPlan === idx ? 'border-2 border-green-500' : ''}`}
                        >
                            {purchasedPlan === idx && (
                                <div className="absolute -top-2 left-2">
                                    <span className="bg-green-600 text-white px-2 py-1 rounded-[8px] text-xs font-semibold">
                                        CURRENT PLAN
                                    </span>
                                </div>
                            )}

                            {plan.popular && purchasedPlan !== idx && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-purple-600 text-white px-3 py-1 rounded-[12px] text-xs font-semibold">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-6 h-6 rounded-[12px] border-2 flex items-center justify-center ${selectedPlan === idx ? 'bg-purple-600 border-purple-500' : 'border-gray-500'
                                        }`}>
                                        {selectedPlan === idx && <Check className="w-4 h-4 text-black" />}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{plan.avatars}</div>
                                        <div className="text-gray-400 text-sm">{plan.variations}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold text-lg">{plan.price}pkr</div>
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
                    className={`w-full font-semibold py-4 rounded-lg text-lg mt-2 transition-colors duration-200 focus:ring-opacity-50 cursor-pointer ${purchasedPlan === selectedPlan
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                >
                    {purchasedPlan === selectedPlan
                        ? 'Your Current Plan'
                        : `Buy ${plans[selectedPlan]?.avatars} Plan`
                    }
                </button>
            </div>
        </div>
    );
};

export default Pricingplan;