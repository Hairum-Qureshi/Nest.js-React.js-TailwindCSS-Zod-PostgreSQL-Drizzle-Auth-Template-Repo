import type { UserPayload } from "./user.js";

type AuthRequest = Request & {
	user?: UserPayload;
};

export type { AuthRequest };
