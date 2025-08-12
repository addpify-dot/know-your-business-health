import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const AppMenu = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 rounded-md text-sm transition-colors",
      isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-semibold tracking-tight text-foreground">
            Business Health
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/" end className={navLinkCls}>
                    Home
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/" className={navLinkCls}>
                    Start Assessment
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/dashboard" className={navLinkCls}>
                    Dashboard
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-6 grid gap-1">
                <Link
                  to="/"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm hover:bg-muted",
                    isActive("/") ? "text-primary font-medium" : "text-foreground/80"
                  )}
                >
                  Home
                </Link>
                <Link
                  to="/"
                  className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                >
                  Start Assessment
                </Link>
                <Link
                  to="/dashboard"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm hover:bg-muted",
                    isActive("/dashboard")
                      ? "text-primary font-medium"
                      : "text-foreground/80"
                  )}
                >
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppMenu;
