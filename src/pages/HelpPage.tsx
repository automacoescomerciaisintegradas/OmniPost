import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, LifeBuoy } from 'lucide-react';
const faqs = [
  {
    question: "How do I create a new profile?",
    answer: "Navigate to the 'Manage Profiles' page from the sidebar. Click the 'Create Profile' button, enter a unique name for your profile, and click 'Create'. Your new profile will appear in the list."
  },
  {
    question: "Where can I find my API key?",
    answer: "Go to the 'API Keys' page. If you don't have a key, you can generate one. Please note that for security reasons, your secret key is only shown once upon creation. Make sure to store it in a safe place."
  },
  {
    question: "Which social media platforms are supported?",
    answer: "We support uploading to Facebook, Instagram, LinkedIn, TikTok, X (formerly Twitter), and Threads. You can select which platforms to post to from the dashboard."
  },
  {
    question: "What happens if my upload fails?",
    answer: "If an upload fails, you will receive an error message with details about the cause. Common reasons include incorrect API keys, an invalid profile name, or media that doesn't meet the platform's requirements. Please check the API documentation for format requirements."
  },
  {
    question: "How do I upgrade my plan?",
    answer: "You can view and compare all available plans on the 'Pricing' page. To upgrade, click the 'Upgrade' button on your desired plan and follow the instructions. All subscriptions are securely managed via Stripe."
  }
];
export function HelpPage() {
  return (
    <AppLayout container>
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions and get in touch with our support team."
        showBackButton
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a href="mailto:support@omnipost.ai" className="w-full">
                <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-muted-foreground">support@omnipost.ai</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                For technical details, check out our comprehensive API docs.
              </p>
              <a href="/docs" className="w-full">
                <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent transition-colors">
                  <LifeBuoy className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Read Docs</p>
                    <p className="text-sm text-muted-foreground">API reference and guides</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}