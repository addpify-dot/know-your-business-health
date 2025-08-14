import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Share2, Download, Bot } from "lucide-react";
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
import { toast } from "sonner";
import { getSavedAssessments } from "@/lib/storage";

const AppMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 rounded-md text-sm transition-colors",
      isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"
    );

  const handleShareApp = async () => {
    const url = window.location.origin;
    const title = "Business Health Checkup";
    const text = "Check your business health in minutes.";
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user canceled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      } catch {
        toast("Copy failed. Please copy the URL manually.");
      }
    }
  };

  const handleDownloadResults = () => {
    if (location.pathname === "/") {
      window.dispatchEvent(new Event("bhc:download-results"));
      return;
    }
    const saved = getSavedAssessments();
    if (saved.length > 0) {
      navigate("/", { state: { autoDownloadResults: true } });
    } else {
      navigate("/");
      toast("Please complete an assessment first");
    }
  };
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
          <div className="flex items-center gap-2 ml-2">
            <Button variant="default" size="sm" onClick={() => window.dispatchEvent(new Event("bhc:open-ai-chat"))} className="hidden md:inline-flex">
              <Bot className="h-4 w-4 mr-2" />
              Smart With AI
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShareApp} className="hidden md:inline-flex">
              <Share2 className="h-4 w-4 mr-2" />
              Share App
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadResults} className="hidden md:inline-flex">
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </Button>
          </div>
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
                <Button onClick={() => window.dispatchEvent(new Event("bhc:open-ai-chat"))} className="justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  Smart With AI
                </Button>
                <Button onClick={handleShareApp} variant="ghost" className="justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share App
                </Button>
                <Button onClick={handleDownloadResults} variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppMenu;
