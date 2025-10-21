import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Plan } from '@shared/types';
import { Link } from 'react-router-dom';
const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    pricePeriod: '/ month',
    features: [
      '10 uploads per month',
      '1 Profile',
      'Basic platform support',
      'Community support',
    ],
    isCurrent: true,
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    pricePeriod: '/ month',
    features: [
      '1,000 uploads per month',
      '10 Profiles',
      'All platform support (incl. TikTok)',
      'Priority email support',
      'Advanced analytics (coming soon)',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    pricePeriod: '',
    features: [
      'Unlimited uploads',
      'Unlimited Profiles',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 priority support',
    ],
    cta: 'Contact Sales',
  },
];
export function PricingPage() {
  return (
    <AppLayout container>
      <PageHeader
        title="Pricing Plans"
        description="Choose the plan that's right for you. Simple, transparent pricing."
        showBackButton
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'flex flex-col h-full transition-all duration-300',
              plan.isCurrent ? 'border-primary shadow-primary/20 shadow-lg scale-105' : 'hover:shadow-lg hover:-translate-y-1'
            )}
          >
            {plan.isCurrent && (
              <Badge className="absolute -top-3 right-5">Current Plan</Badge>
            )}
            <CardHeader>
              <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.pricePeriod}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.id === 'free' ? (
                <Link to="/dashboard" className="w-full">
                  <Button className="w-full" variant={plan.isCurrent ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" variant={plan.isCurrent ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}