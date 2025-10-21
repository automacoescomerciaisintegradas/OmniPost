import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/ui/badge';
const curlExample = `curl \\
-H 'Authorization: Apikey your-api-key-here' \\
-F 'media=@/path/to/your/video.mp4' \\
-F 'title="Your Video Title"' \\
-F 'profileId="your_profile_id"' \\
-F 'platform[]=tiktok' \\
-F 'platform[]=instagram' \\
-X POST https://api.omnipost.ai/api/upload`;
export function DocsPage() {
  return (
    <AppLayout container>
      <PageHeader
        title="API Documentation"
        description="Integrate OmniPost AI into your workflow with our powerful and simple API."
        showBackButton
      />
      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Authenticate your API requests by including your secret key in the Authorization header.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              To use your API key, include it in the <code className="font-mono bg-muted p-1 rounded-md">Authorization</code> header of your requests with the <code className="font-mono bg-muted p-1 rounded-md">Apikey</code> scheme.
            </p>
            <CodeBlock code={curlExample} language="bash" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Endpoint: /api/upload</CardTitle>
            <CardDescription>
              The primary endpoint for uploading media content. It accepts <code className="font-mono bg-muted p-1 rounded-md">multipart/form-data</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono">media</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell>The video or image file you want to upload.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">title</TableCell>
                  <TableCell>String</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell>The caption or description for your post. Hashtags can be included here.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">profileId</TableCell>
                  <TableCell>String</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell>The ID of the profile (created in 'Manage Profiles') to use for this upload.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono">platform[]</TableCell>
                  <TableCell>Array of Strings</TableCell>
                  <TableCell><Badge>Required</Badge></TableCell>
                  <TableCell>The platforms to publish to. Supported: <code className="font-mono text-xs">tiktok</code>, <code className="font-mono text-xs">instagram</code>, <code className="font-mono text-xs">facebook</code>, etc.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Video Format Requirements (TikTok)</CardTitle>
            <CardDescription>
              Ensure your video files meet these requirements for successful uploads to TikTok.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Supported Formats:</strong> MP4, WebM</li>
              <li><strong>Supported Codecs:</strong> H.264, H.265 (HEVC)</li>
              <li><strong>Frame Rate:</strong> Minimum 23 FPS, Maximum 60 FPS</li>
              <li><strong>Dimensions:</strong> Minimum 360x360 pixels</li>
              <li><strong>Duration:</strong> Minimum 3 seconds, Maximum 10 minutes</li>
              <li><strong>File Size:</strong> Maximum 1 GB</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}