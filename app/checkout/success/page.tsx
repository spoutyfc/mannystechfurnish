import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-neutral-400 mb-8 text-lg">
          Thank you for choosing Manny&apos;s Tech Furnish. We&apos;ve received your payment and will be in touch soon with next steps.
        </p>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 mb-8">
          <p className="text-sm text-neutral-500 mb-2">Session ID</p>
          <p className="text-white font-mono text-sm break-all">
            {/* @ts-ignore */}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-neutral-400">
            A confirmation email has been sent to your email address.
          </p>
          <p className="text-neutral-500 text-sm">
            Check your inbox for your project details and next steps.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full mt-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
