export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  popular?: boolean
  deliveryTime: string
}

// Mansoor's productized services
export const PRODUCTS: Product[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'A high-converting landing page designed to capture leads and drive action.',
    priceInCents: 300000, // $3,000
    deliveryTime: '1-2 weeks',
    features: [
      'Custom design from scratch',
      'Mobile-responsive layout',
      'SEO optimization',
      'Contact form integration',
      'Analytics setup',
      '2 rounds of revisions',
    ],
  },
  {
    id: 'full-website',
    name: 'Full Website',
    description: 'A complete multi-page website that tells your brand story and converts visitors.',
    priceInCents: 500000, // $5,000
    deliveryTime: '2-3 weeks',
    popular: true,
    features: [
      'Up to 5 custom pages',
      'Content management system',
      'Blog functionality',
      'Contact & booking forms',
      'SEO & performance optimization',
      'Social media integration',
      '3 rounds of revisions',
      '30 days post-launch support',
    ],
  },
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'A full-stack web application with authentication, database, and custom features.',
    priceInCents: 1000000, // $10,000
    deliveryTime: '4-6 weeks',
    features: [
      'Custom web application',
      'User authentication',
      'Database integration',
      'Admin dashboard',
      'API development',
      'Third-party integrations',
      'Deployment & hosting setup',
      '60 days post-launch support',
    ],
  },
]
