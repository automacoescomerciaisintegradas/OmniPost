import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { CodeBlock } from '@/components/CodeBlock';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { PlusCircle, Trash2, KeyRound, AlertTriangle, Copy } from 'lucide-react';
import { format } from 'date-fns';
import type { ApiKey } from '@shared/types';
export function ApiKeysPage() {
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<ApiKey | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const { apiKeys, loading, error, fetchApiKeys, createApiKey, deleteApiKey } = useAppStore();
  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);
  const handleGenerateKey = async () => {
    try {
      const newKey = await createApiKey();
      setNewlyGeneratedKey(newKey);
      toast.success('API Key generated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate API key.');
    }
  };
  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;
    try {
      await deleteApiKey(keyToRevoke.id);
      toast.success('API Key revoked.');
      setKeyToRevoke(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to revoke API key.');
    }
  };
  const renderContent = () => {
    if (loading.apiKeys) {
      return (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    }
    if (error.apiKeys) {
      return (
        <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-2 text-lg font-medium text-destructive">Failed to load API keys</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error.apiKeys}</p>
        </div>
      );
    }
    if (apiKeys.length === 0) {
      return (
        <EmptyState
          icon={<KeyRound className="h-10 w-10" />}
          title="No API keys generated yet"
          description="Generate your first API key to start using the OmniPost AI API."
          action={{
            label: 'Generate First Key',
            onClick: handleGenerateKey,
          }}
        />
      );
    }
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-mono">{`${key.key.substring(0, 9)}...${key.key.substring(key.key.length - 4)}`}</TableCell>
                  <TableCell>{format(new Date(key.createdAt), 'PPP')}</TableCell>
                  <TableCell>{key.lastUsed ? format(new Date(key.lastUsed), 'PPP p') : 'Never'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => setKeyToRevoke(key)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  return (
    <AppLayout container>
      <PageHeader
        title="API Keys"
        description="Manage your API keys for programmatic access to OmniPost AI."
        showBackButton
      >
        <Button onClick={handleGenerateKey}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </PageHeader>
      {renderContent()}
      <Dialog open={!!newlyGeneratedKey} onOpenChange={(open) => !open && setNewlyGeneratedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Please copy your new API key. For security reasons, you will not be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <CodeBlock code={newlyGeneratedKey?.key ?? ''} />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to revoke this key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Any applications using this key will no longer be able to access the API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeKey} className="bg-destructive hover:bg-destructive/90">
              Yes, revoke key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}