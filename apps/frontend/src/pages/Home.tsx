import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Home() {
  const { data: currUserData } = useCurrentUser();

  return (
    <div className="min-h-screen max-h-auto p-10 bg-white relative overflow-hidden flex flex-col">
      <h1 className="text-3xl font-semibold text-black">Hello</h1>
      <p className="text-lg font-semibold my-5">
        If you're not seeing the Google OAuth button, it's due to the{" "}
        <code className="bg-gray-100 text-base text-green-600 p-1 rounded">
          /api/auth/current-user
        </code>{" "}
        API endpoint returning HTML so technically{" "}
        <code className="bg-gray-100 text-base text-green-600 p-1 rounded">
          currUserData
        </code>{" "}
        isn't undefined. Once you provide the appropriate backend{" "}
        <code className="bg-gray-100 text-base text-green-600 p-1 rounded">
          env
        </code>{" "}
        variables and the appropriate data, the endpoint will work and you'll
        see the button below.
      </p>
     

      <div className="flex flex-col items-center gap-4">
        {!currUserData && <GoogleOAuthButton />}
      </div>
    </div>
  );
}
