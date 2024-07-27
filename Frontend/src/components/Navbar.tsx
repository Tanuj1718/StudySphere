"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../../lib/utils";
import Link from "next/link";

function Navbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <NavbarContents className="top-2" />
    </div>
  );
}
export default Navbar

function NavbarContents({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 ", className)}
    >
      <Menu setActive={setActive}>
        <Link href="/">Home</Link>
        <Link href="/post">Create Post</Link>
        <Link href="/posts">All Posts</Link>
        <Link href="/signin">Login</Link>
        <Link href="/signup">Register</Link>
      </Menu>
    </div>
  );
}
