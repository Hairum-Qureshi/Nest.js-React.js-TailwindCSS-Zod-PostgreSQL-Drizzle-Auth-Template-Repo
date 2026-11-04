interface UseGoogleAuthHook {
	googleSignInMutation: (credential: string) => Promise<void>;
	signOut: () => Promise<void>;
}

export type { UseGoogleAuthHook };
