import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useAppStore } from '@/stores/app-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Users, AlertTriangle, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { format } from 'date-fns';
import type { Profile, SocialPlatform, ConnectedAccount } from '@shared/types';
import { cn } from '@/lib/utils';
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12.528 8.528a3.5 3.5 0 1 0-3.5 3.5v8a3.5 3.5 0 1 0 7 0v-8a3.5 3.5 0 1 0-3.5-3.5z"/></svg>
);
const ThreadsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 12c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0 0c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"/></svg>
);
const socialIcons: Record<SocialPlatform, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  tiktok: <TikTokIcon />,
  x: <Twitter className="h-4 w-4" />,
  threads: <ThreadsIcon />,
};
const profileSchema = z.object({
  name: z.string().min(3, 'Profile name must be at least 3 characters.').max(50, 'Profile name must be at most 50 characters.').regex(/^[a-zA-Z0-9_@-]+$/, 'Only letters, numbers, underscores, hyphens, and @ are allowed.')
});
type ProfileFormData = z.infer<typeof profileSchema>;
const connectAccountSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'threads']),
  username: z.string().min(1, 'Username is required.'),
});
type ConnectAccountFormData = z.infer<typeof connectAccountSchema>;
export function ProfilesPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const profiles = useAppStore(state => state.profiles);
  const loading = useAppStore(state => state.loading);
  const error = useAppStore(state => state.error);
  const fetchProfiles = useAppStore(state => state.fetchProfiles);
  const createProfile = useAppStore(state => state.createProfile);
  const deleteProfile = useAppStore(state => state.deleteProfile);
  const updateProfile = useAppStore(state => state.updateProfile);
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);
  const createForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '' }
  });
  const connectForm = useForm<ConnectAccountFormData>({
    resolver: zodResolver(connectAccountSchema),
    defaultValues: { username: '' }
  });
  const handleCreateProfile = async (data: ProfileFormData) => {
    try {
      await createProfile(data.name);
      toast.success('Profile created successfully!');
      createForm.reset();
      setCreateDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create profile.');
    }
  };
  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;
    try {
      await deleteProfile(profileToDelete.id);
      toast.success(`Profile "${profileToDelete.name}" deleted.`);
      setProfileToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete profile.');
    }
  };
  const handleConnectAccount = async (data: ConnectAccountFormData) => {
    if (!profileToEdit) return;
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      platform: data.platform,
      username: data.username,
    };
    const updatedAccounts = [...profileToEdit.connectedAccounts, newAccount];
    try {
      await updateProfile(profileToEdit.id, updatedAccounts);
      toast.success(`Connected ${data.platform} account.`);
      setProfileToEdit(null);
      connectForm.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect account.');
    }
  };
  const renderContent = () => {
    if (loading.profiles) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) =>
            <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-1/2" /></CardContent><CardFooter className="gap-2"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-20" /></CardFooter></Card>
          )}
        </div>
      );
    }
    if (error.profiles) {
      return (
        <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" /><h3 className="mt-2 text-lg font-medium text-destructive">Failed to load profiles</h3><p className="mt-1 text-sm text-muted-foreground">{error.profiles}</p>
        </div>
      );
    }
    if (profiles.length === 0) {
      return (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No profiles yet"
          description="Create your first profile to manage a set of social media accounts."
          action={{ label: 'Create First Profile', onClick: () => setCreateDialogOpen(true) }}
        />
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) =>
          <Card key={profile.id} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">{profile.name}</CardTitle>
              <CardDescription>Created on {format(new Date(profile.createdAt), 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Connected Accounts</h4>
              {profile.connectedAccounts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.connectedAccounts.map(acc => (
                    <div key={acc.id} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                      {socialIcons[acc.platform]}
                      <span>{acc.username}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/70 italic">No accounts connected.</p>
              )}
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm" onClick={() => setProfileToEdit(profile)}><LinkIcon className="mr-2 h-4 w-4" />Connect</Button>
              <Button variant="destructive" size="sm" onClick={() => setProfileToDelete(profile)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };
  return (
    <AppLayout container>
      <PageHeader title="Manage Profiles" description="Create and manage profiles to group your social media accounts." showBackButton>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Create Profile</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create a New Profile</DialogTitle><DialogDescription>Give your profile a unique name. e.g., business_account, personal_brand</DialogDescription></DialogHeader>
            <Form {...createForm}><form onSubmit={createForm.handleSubmit(handleCreateProfile)} className="space-y-4"><FormField control={createForm.control} name="name" render={({ field }) => <FormItem><FormLabel>Profile Name</FormLabel><FormControl><Input placeholder="e.g., business_account" {...field} /></FormControl><FormMessage /></FormItem>} /><DialogFooter><Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={createForm.formState.isSubmitting}>{createForm.formState.isSubmitting ? 'Creating...' : 'Create Profile'}</Button></DialogFooter></form></Form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      {renderContent()}
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the <strong>{profileToDelete?.name}</strong> profile.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive hover:bg-destructive/90">Yes, delete profile</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={!!profileToEdit} onOpenChange={(open) => !open && setProfileToEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect Social Account</DialogTitle><DialogDescription>Connect a new account to the "{profileToEdit?.name}" profile.</DialogDescription></DialogHeader>
          <Form {...connectForm}><form onSubmit={connectForm.handleSubmit(handleConnectAccount)} className="space-y-4">
            <FormField control={connectForm.control} name="platform" render={({ field }) => <FormItem><FormLabel>Platform</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl><SelectContent>{Object.keys(socialIcons).map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
            <FormField control={connectForm.control} name="username" render={({ field }) => <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="@username" {...field} /></FormControl><FormMessage /></FormItem>} />
            <DialogFooter><Button type="button" variant="outline" onClick={() => setProfileToEdit(null)}>Cancel</Button><Button type="submit" disabled={connectForm.formState.isSubmitting}>{connectForm.formState.isSubmitting ? 'Connecting...' : 'Connect Account'}</Button></DialogFooter>
          </form></Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}