"use client";
import { useSearchParams } from 'next/navigation';

export default function Success() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your transaction has been completed successfully.</p>
      </div>

      <div className="p-6 rounded-lg border border-gray-200 w-full max-w-md mb-8">
        <h2 className="font-semibold text-lg text-black mb-4 text-center">Order Confirmation</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-2">Your Order ID:</p>
          <p className="text-lg font-mono font-bold text-gray-900 bg-gray-50 p-3 rounded">
            {orderId || 'Loading...'}
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center">
        A receipt for your purchase has been sent to your email.
      </p>
    </div>
  );
}