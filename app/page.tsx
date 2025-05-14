import { auth, signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session?.user)}
      <form
        action={async () => {
          "use server";
          try {
            await signIn("github");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <button type="submit">Signin with GitHub</button>
      </form>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Signin Out</button>
      </form>
      <br />
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
      >
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button>Sign In</button>
      </form>
    </div>
  );
}
