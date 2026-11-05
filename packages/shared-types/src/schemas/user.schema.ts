import { z } from "zod";

export const UserPayloadSchema = z.object({
	id: z.string(),
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.email(),
	profilePicture: z.url(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime()
});

export type UserPayload = z.infer<typeof UserPayloadSchema>;
