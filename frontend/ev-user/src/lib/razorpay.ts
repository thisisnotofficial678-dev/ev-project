declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export type StartPaymentParams = {
  amountInPaise: number;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
};

export const startRazorpayPayment = async (
  params: StartPaymentParams,
  onSuccess: (resp: any) => void,
  onFailure: (err: any) => void
) => {
  try {
    console.log('Loading Razorpay...');
    const ok = await loadRazorpay();
    if (!ok) {
      console.error('Failed to load Razorpay script');
      onFailure(new Error('Failed to load Razorpay'));
      return;
    }

    // Use a working test key - you can replace this with your actual test key
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51H5jKEDCmMbuJ';
    console.log('Using Razorpay key:', key);

    const options = {
      key,
      amount: params.amountInPaise,
      currency: 'INR',
      name: params.name,
      description: params.description,
      handler: (response: any) => {
        console.log('Payment success:', response);
        onSuccess(response);
      },
      prefill: params.prefill || {},
      theme: { color: '#16a34a' },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        }
      }
    };

    console.log('Creating Razorpay instance with options:', options);
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response);
      onFailure(response);
    });

    console.log('Opening Razorpay modal...');
    rzp.open();
  } catch (error) {
    console.error('Error in startRazorpayPayment:', error);
    onFailure(error);
  }
};


