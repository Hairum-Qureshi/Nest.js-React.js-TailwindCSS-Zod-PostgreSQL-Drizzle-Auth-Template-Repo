import { GoogleLogin } from "@react-oauth/google";
import useGoogleAuth from "../hooks/useGoogleAuth";

export default function GoogleOAuthButton() {
  const { googleSignInMutation } = useGoogleAuth();
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        googleSignInMutation(credentialResponse.credential as string);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}