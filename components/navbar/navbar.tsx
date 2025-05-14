import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { NavUser } from "./nav-user";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const data = await auth();

  return (
    <nav className="h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={"/"}>
          <Logo />
        </Link>

        {data?.user ? (
          <div className="flex items-center gap-3">
            <NavUser
              user={{
                name: data.user.name!,
                avatar: data.user.image!,
                email: data.user.email!,
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href={"/auth/signin"}>
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
