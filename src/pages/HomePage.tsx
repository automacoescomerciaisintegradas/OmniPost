import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Circle, KeyRound, Users, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
export function HomePage() {
  const profiles = useAppStore((state) => state.profiles);
  const apiKeys = useAppStore((state) => state.apiKeys);
  const onboardingSteps = [
    {
      icon: <Users className="h-6 w-6" />,
      title: '1. Create your first profile',
      description: 'Profiles group your social media accounts for easy management.',
      link: '/profiles',
      completed: profiles.length > 0,
    },
    {
      icon: <KeyRound className="h-6 w-6" />,
      title: '2. Generate your API key',
      description: 'Create a secure key to use our API for automation.',
      link: '/api-keys',
      completed: apiKeys.length > 0,
    },
    {
      icon: <UploadCloud className="h-6 w-6" />,
      title: '3. Make your first upload',
      description: 'Use the dashboard or API to post content to your accounts.',
      link: '/dashboard',
      completed: false, // This step cannot be tracked via existing stores
    },
  ];
  return (
    <AppLayout container>
      <PageHeader
        title="Welcome to OmniPost AI!"
        description="Your all-in-one solution for social media content management."
      />
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight font-display mb-4">Getting Started</h2>
          <p className="text-muted-foreground max-w-2xl">
            Follow these simple steps to get your account set up and start posting content across all your platforms seamlessly.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {onboardingSteps.map((step, index) => (
            <Link to={step.link} key={index} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <Card className="h-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className={step.completed ? "text-green-500" : "text-muted-foreground"}>
                    {step.completed ? <CheckCircle className="h-8 w-8" /> : <Circle className="h-8 w-8" />}
                  </div>
                  <div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription className="mt-1">{step.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Check out our documentation for detailed guides and API references, or contact our support team if you get stuck.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AppLayout>
  );
}