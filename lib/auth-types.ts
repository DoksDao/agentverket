export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export interface AppWorkspace {
  id: string;
  name: string;
  slug: string;
}

export interface AuthenticatedAppSession {
  sessionId: string;
  user: AppUser;
  workspace: AppWorkspace;
}
