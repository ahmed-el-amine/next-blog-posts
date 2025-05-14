import { Logout } from "@/actions/auth.action";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRef } from "react";

export const SignOutButton = () => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form action={Logout} ref={ref}>
      <DropdownMenuItem onClick={() => ref.current?.requestSubmit()}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </form>
  );
};
