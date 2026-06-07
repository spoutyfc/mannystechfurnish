import CheckoutForm from '@/app/components/checkout-form'

export default function ClientCheckoutPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  return <CheckoutForm />
}
