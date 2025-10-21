import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}
export function PageHeader({ title, description, children, showBackButton = false }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="outline" size="icon" className="flex-shrink-0" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">{title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{description}</p>
          </div>
        </div>
        {children && <div className="flex-shrink-0 self-start sm:self-center">{children}</div>}
      </div>
    </div>
  );
}