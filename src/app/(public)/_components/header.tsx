"use client"

import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const session = null;

  const navItems = [
    { href: "#profissionais", label: "Profissionais" }
  ]

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          className="bg-transparent hover:bg-transparent text-black shadow-none text-base"
          render={
            <Link href={item.href} />
          }
          nativeButton={false}
          onClick={() => setIsMenuOpen(false)}
        >
          {item.label}
        </Button>
      ))}

      {session ? (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2"
        >
          Acessar clinica
        </Link>
      ) : (
        <Button className="flex items-center justify-center gap-2">
          <LogIn />
          Portal da clinica
        </Button>
      )}
    </>
  )

  return (
    <header 
      className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          href="/"
          className="text-3xl font-bold text-zinc-900"
        >
          Odonto
          <span className="text-emerald-500">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button
                className="text-black hover:bg-transparent"
                variant={"ghost"}
                size={"icon"}
              />
            }
          >
            <Menu className="w-6 h-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[240px] sm:w-[300px] z-[9999]"
          >
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Veja nossos links.
              </SheetDescription>
            </SheetHeader>
            
            <nav className="flex flex-col space-y-4 mt-6 px-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )  
}