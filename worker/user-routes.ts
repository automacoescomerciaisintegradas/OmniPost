import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProfileEntity, ApiKeyEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Profile, ApiKey, ConnectedAccount } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROFILES API
  app.get('/api/profiles', async (c) => {
    const page = await ProfileEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/profiles', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!isStr(name) || name.length < 3 || name.length > 50) {
      return bad(c, 'Profile name must be between 3 and 50 characters.');
    }
    if (!/^[a-zA-Z0-9_@-]+$/.test(name)) {
        return bad(c, 'Profile name can only contain letters, numbers, underscores, hyphens, and @.');
    }
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      connectedAccounts: [],
      createdAt: new Date().toISOString(),
    };
    const created = await ProfileEntity.create(c.env, newProfile);
    return ok(c, created);
  });
  app.put('/api/profiles/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const { connectedAccounts } = (await c.req.json()) as { connectedAccounts?: ConnectedAccount[] };
    if (!connectedAccounts) {
      return bad(c, 'Missing connectedAccounts data.');
    }
    const profile = new ProfileEntity(c.env, id);
    if (!(await profile.exists())) {
      return notFound(c, 'Profile not found');
    }
    await profile.patch({ connectedAccounts });
    return ok(c, await profile.getState());
  });
  app.delete('/api/profiles/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await ProfileEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Profile not found');
    return ok(c, { id, deleted: true });
  });
  // API KEYS API
  app.get('/api/api-keys', async (c) => {
    const page = await ApiKeyEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/api-keys', async (c) => {
    const newApiKey: ApiKey = {
      id: crypto.randomUUID(),
      key: `op_sk_${crypto.randomUUID().replace(/-/g, '')}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    const created = await ApiKeyEntity.create(c.env, newApiKey);
    return ok(c, created);
  });
  app.delete('/api/api-keys/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await ApiKeyEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'API Key not found');
    return ok(c, { id, deleted: true });
  });
  // UPLOAD API
  app.post('/api/upload', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Apikey ')) {
      return c.json({ success: false, error: 'Unauthorized: Missing API Key' }, 401);
    }
    const apiKey = authHeader.substring(7);
    const { items: allKeys } = await ApiKeyEntity.list(c.env);
    const keyEntity = allKeys.find(k => k.key === apiKey);
    if (!keyEntity) {
      return c.json({ success: false, error: 'Unauthorized: Invalid API Key' }, 401);
    }
    const formData = await c.req.formData();
    const media = formData.get('media');
    const title = formData.get('title');
    const profileId = formData.get('profileId');
    const platforms = formData.getAll('platform[]');
    if (!media || !(media instanceof File) || media.size === 0) return bad(c, 'Media file is required.');
    if (!isStr(title)) return bad(c, 'Title is required.');
    if (!isStr(profileId)) return bad(c, 'Profile ID is required.');
    if (platforms.length === 0) return bad(c, 'At least one platform is required.');
    // Validate profile existence
    const profile = new ProfileEntity(c.env, profileId);
    if (!(await profile.exists())) {
      return bad(c, 'Profile not found.');
    }
    // Update API key last used timestamp
    const keyToUpdate = new ApiKeyEntity(c.env, keyEntity.id);
    await keyToUpdate.patch({ lastUsed: new Date().toISOString() });
    // Simulate upload success
    return ok(c, {
      message: 'Upload successful!',
      fileName: media.name,
      size: media.size,
      profileId,
      platforms,
    });
  });
  // ACCOUNT API
  app.get('/api/account', async (c) => {
    // In a real app, you'd get this from a session or user token
    const mockAccount = {
        id: 'user_123',
        email: 'automacoescomerciais@gmail.com',
        plan: 'Free',
        avatarUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=automacoescomerciais@gmail.com`,
    };
    return ok(c, mockAccount);
  });
  app.post('/api/account/avatar', async (c) => {
    const formData = await c.req.formData();
    const avatar = formData.get('avatar');
    if (!avatar || !(avatar instanceof File) || avatar.size === 0) {
        return bad(c, 'Avatar file is required.');
    }
    // Simulate file processing/uploading to a storage service (e.g., R2)
    // Here, we just generate a new random avatar URL to simulate the change.
    const newAvatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${crypto.randomUUID()}`;
    return ok(c, { newAvatarUrl });
  });
}