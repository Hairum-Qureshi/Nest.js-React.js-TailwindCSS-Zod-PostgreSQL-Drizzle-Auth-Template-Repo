import type { UserPayload } from "../schemas/user.schema.ts";

type AuthRequest = Request & {
	user?: UserPayload;
};

export type { AuthRequest };
