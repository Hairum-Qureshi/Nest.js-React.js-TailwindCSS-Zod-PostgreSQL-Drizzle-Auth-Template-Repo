import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseGoogleAuthHook } from "@repo/shared-types";

export default function useGoogleAuth(): UseGoogleAuthHook {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const googleSignInMutation = useMutation({
		mutationFn: async (credential: string) => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/google/sign-in`,
				{},
				{
					headers: {
						Authorization: `Bearer ${credential}`
					},
					withCredentials: true
				}
			);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["currentUser"]
			});

			navigate("/profile");
		}
	});

	const signOutMutation = useMutation({
		mutationFn: async () => {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-out`,
				{},
				{
					withCredentials: true
				}
			);
		},
		onSuccess: () => {
			queryClient.setQueryData(["currentUser"], null);
		}
	});

	return {
		googleSignInMutation: googleSignInMutation.mutateAsync,
		signOut: signOutMutation.mutateAsync
	};
}
