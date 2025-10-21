import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import { UploadCloud, AlertTriangle, LogOut } from 'lucide-react';
export function AccountPage() {
  const account = useAppStore(s => s.account);
  const loading = useAppStore(s => s.loading.account);
  const avatarLoading = useAppStore(s => s.loading.avatar);
  const error = useAppStore(s => s.error.account);
  const fetchAccount = useAppStore(s => s.fetchAccount);
  const uploadAvatar = useAppStore(s => s.uploadAvatar);
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!account) {
      fetchAccount();
    }
  }, [account, fetchAccount]);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const promise = uploadAvatar(file);
      toast.promise(promise, {
        loading: 'Uploading avatar...',
        success: 'Avatar updated successfully!',
        error: (err) => err.message || 'Failed to upload avatar.',
      });
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info("You have been logged out.");
  };
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="flex flex-col items-center text-center p-6">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Loading your subscription details...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Skeleton className="h-10 w-40" />
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }
    if (error || !account) {
      return (
        <Card className="text-center py-10 px-4 bg-destructive/10">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-2 text-lg font-medium text-destructive">Failed to load account details</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error || 'Could not find account information.'}</p>
        </Card>
      );
    }
    return (
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="flex flex-col items-center text-center p-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-4 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={account.avatarUrl || ''} alt="User Avatar" />
                  <AvatarFallback className="text-3xl">{account.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAvatarClick}>
                  <UploadCloud className="h-8 w-8 text-white" />
                </div>
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-primary border-white/20 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
              <h2 className="text-xl font-semibold">{account.email.split('@')[0]}</h2>
              <p className="text-muted-foreground">{account.email}</p>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>We use Stripe for secure subscription and payment management.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Plan</span>
                  <Badge variant={account.plan === 'Pro' ? 'default' : 'secondary'}>{account.plan}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Active</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button>Manage Subscription</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Logout</CardTitle>
            <CardDescription>End your current session and return to the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };
  return (
    <AppLayout container>
      <PageHeader
        title="My Account"
        description="View your account details and manage your subscription."
        showBackButton
      />
      {renderContent()}
    </AppLayout>
  );
}