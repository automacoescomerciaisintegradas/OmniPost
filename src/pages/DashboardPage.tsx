import React, { useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppStore } from '@/stores/app-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Info, UploadCloud, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
const socialPlatforms = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'threads', label: 'Threads' },
];
const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
const uploadSchema = z.object({
  profileId: z.string().min(1, 'A profile must be selected.'),
  title: z.string().min(1, 'A title or caption is required.').max(2200, 'Caption is too long.'),
  media: z.any()
    .refine((files) => files?.length == 1, 'A media file is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 100MB.`)
    .refine((files) => ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type), '.jpg, .jpeg, .png, .webp and .mp4 files are accepted.'),
  platforms: z.array(z.string()).min(1, 'At least one platform must be selected.'),
});
type UploadFormData = z.infer<typeof uploadSchema>;
export function DashboardPage() {
  const profiles = useAppStore(s => s.profiles);
  const profilesLoading = useAppStore(s => s.loading.profiles);
  const fetchProfiles = useAppStore(s => s.fetchProfiles);
  const apiKeys = useAppStore(s => s.apiKeys);
  const apiKeysLoading = useAppStore(s => s.loading.apiKeys);
  const fetchApiKeys = useAppStore(s => s.fetchApiKeys);
  const apiKey = useMemo(() => (apiKeys.length > 0 ? apiKeys[0].key : null), [apiKeys]);
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      profileId: '',
      title: '',
      media: undefined,
      platforms: [],
    },
  });
  useEffect(() => {
    fetchProfiles();
    fetchApiKeys();
  }, [fetchProfiles, fetchApiKeys]);
  const onSubmit = async (data: UploadFormData) => {
    if (!apiKey) {
      toast.error('API Key is missing. Please generate one in the API Keys page.');
      return;
    }
    const formData = new FormData();
    formData.append('profileId', data.profileId);
    formData.append('title', data.title);
    formData.append('media', data.media[0]);
    data.platforms.forEach(p => formData.append('platform[]', p));
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Apikey ${apiKey}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      toast.success('Content uploaded successfully!');
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };
  const noApiKey = !apiKeysLoading && apiKeys.length === 0;
  return (
    <AppLayout container>
      <PageHeader
        title="Dashboard"
        description="Upload to all your platforms with one click."
      />
      {noApiKey && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No API Key Found</AlertTitle>
          <AlertDescription>
            You must generate an API key before you can upload content.
            <Link to="/api-keys" className="font-bold underline ml-2">Go to API Keys</Link>
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <fieldset disabled={noApiKey || form.formState.isSubmitting} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Configure Main Content</CardTitle>
                <CardDescription>Choose the profile, content source, and main copy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="profileId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile</FormLabel>
                      {profilesLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a profile..." /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {profiles.length > 0 ? (
                              profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)
                            ) : (
                              <div className="p-4 text-sm text-muted-foreground">No profiles available.</div>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media (Video/Image)</FormLabel>
                      <FormControl>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="flex text-sm text-muted-foreground">
                              <Label htmlFor="media-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                <span>Upload a file</span>
                                <Input id="media-upload" type="file" className="sr-only"
                                  onChange={(e) => field.onChange(e.target.files)}
                                />
                              </Label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{field.value?.[0]?.name || 'PNG, JPG, MP4 up to 100MB'}</p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title / Caption</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the caption for your post..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Platform-Specific Settings</CardTitle>
                <CardDescription>Enable each network you want to post to.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="platforms"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {socialPlatforms.map((platform) => (
                          <FormField
                            key={platform.id}
                            control={form.control}
                            name="platforms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), platform.id])
                                        : field.onChange(field.value?.filter((value) => value !== platform.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{platform.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage className="pt-2" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </fieldset>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3. Finalize and Upload</CardTitle>
                <CardDescription>
                  Review your post and click upload to send it to the selected platforms.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={noApiKey || form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Uploading...' : <><UploadCloud className="mr-2 h-4 w-4" /> Upload Content</>}
                </Button>
              </CardFooter>
            </Card>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Using the API?</AlertTitle>
              <AlertDescription>
                The dashboard uses the first available API key from the API Keys page for uploads.
                Check out ready-made workflow templates at <a href="#" className="font-medium text-primary hover:underline">omnipost.ai/templates</a>.
              </AlertDescription>
            </Alert>
          </div>
        </form>
      </Form>
    </AppLayout>
  );
}