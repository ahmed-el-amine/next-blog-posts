import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="container flex justify-center items-center">
      <p>
        Go back to
        <Link href="/">
          <Button>Home Page</Button>
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
