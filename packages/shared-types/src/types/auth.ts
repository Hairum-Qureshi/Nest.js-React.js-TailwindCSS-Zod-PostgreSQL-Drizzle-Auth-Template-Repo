import type { UserPayload } from "./user";

type AuthRequest = Request & {
	user?: UserPayload;
};

export type { AuthRequest };
