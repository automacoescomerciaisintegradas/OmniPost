/**
 * Defines the data models and storage logic for Profiles and API Keys for OmniPost AI.
 * These entities extend IndexedEntity to manage data persistence in the GlobalDurableObject.
 */
import { IndexedEntity } from "./core-utils";
import type { Profile, ApiKey } from "@shared/types";
// PROFILE ENTITY: one DO instance per user profile
export class ProfileEntity extends IndexedEntity<Profile> {
  static readonly entityName = "profile";
  static readonly indexName = "profiles";
  static readonly initialState: Profile = { 
    id: "", 
    name: "", 
    connectedAccounts: [], 
    createdAt: "" 
  };
}
// API KEY ENTITY: one DO instance per API key
export class ApiKeyEntity extends IndexedEntity<ApiKey> {
  static readonly entityName = "apikey";
  static readonly indexName = "apikeys";
  static readonly initialState: ApiKey = { 
    id: "", 
    key: "", 
    createdAt: "", 
    lastUsed: null 
  };
}