import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="w-full border-2 border-dashed bg-secondary/50">
      <CardContent className="p-10 sm:p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 text-primary p-4 rounded-full">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
        {action && (
          <Button onClick={action.onClick} className="mt-6">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}