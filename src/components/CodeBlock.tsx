import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}
export function CodeBlock({ code, language = 'bash', className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const copyToClipboard = () => {
    // Fallback for non-secure contexts
    const unsecuredCopyToClipboard = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setHasCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setHasCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy.');
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    };
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setHasCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      }).catch(err => {
        // Fallback if clipboard API fails
        unsecuredCopyToClipboard(code);
      });
    } else {
      unsecuredCopyToClipboard(code);
    }
  };
  return (
    <div className={cn("relative group bg-muted/50 rounded-lg border", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {hasCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="p-4 text-sm overflow-x-auto rounded-lg bg-transparent">
        <code className={`language-${language} font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
}