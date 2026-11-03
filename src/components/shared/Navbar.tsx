
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Aperture,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const jwtRequestRef = useRef<string | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Prevent theme hydration mismatch.
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  const user = session?.user;

  // Close profile dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create JWT cookie when Better Auth session becomes available.
  useEffect(() => {
    if (isPending || !user?.id || !SERVER_URL) return;

    if (jwtRequestRef.current === user.id) return;

    jwtRequestRef.current = user.id;

    const createJwtCookie = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/auth/jwt`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          jwtRequestRef.current = null;
          console.error("Failed to create JWT cookie");
        }
      } catch (error) {
        jwtRequestRef.current = null;
        console.error("JWT Creation Error:", error);
      }
    };

    createJwtCookie();
  }, [user?.id, isPending]);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      if (!SERVER_URL) {
        throw new Error("Server URL is not configured");
      }

      // Clear JWT cookie.
      const jwtResponse = await fetch(`${SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!jwtResponse.ok) {
        throw new Error("JWT logout failed");
      }

      // Sign out from Better Auth.
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed");
      }

      jwtRequestRef.current = null;

      closeMenus();

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-950/95">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Aperture size={24} />
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Studio<span className="text-indigo-600">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-sm font-medium transition-colors ${isActive(link.href)
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          ) : user ? (

            /* Logged In Profile */
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-gray-300 py-1.5 pl-1.5 pr-3 transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    <User size={18} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {user.name || "My Account"}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      href="/add-studio"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <PlusCircle size={17} />
                      Add New Studio
                    </Link>

                    <Link
                      href="/my-listings"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Building2 size={17} />
                      My Studio Listings
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <CalendarDays size={17} />
                      My Bookings
                    </Link>

                    {/* Wishlist */}
                    <Link
                      href="/wishlist"
                      onClick={closeMenus}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive("/wishlist")
                          ? "bg-red-50 font-semibold text-red-600 dark:bg-red-950 dark:text-red-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                    >
                      <Heart
                        size={17}
                        className="text-red-500"
                      />
                      My Wishlist
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 p-2 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (

            /* Logged Out */
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 lg:hidden">

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-5 dark:border-gray-700 dark:bg-gray-950 lg:hidden">

          {/* Public Navigation */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${isActive(link.href)
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Account Section */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ) : user ? (

              <div className="space-y-2">

                {/* User Info */}
                <div className="mb-3 flex items-center gap-3 px-3 py-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                      <User size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/add-studio"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <PlusCircle size={18} />
                  Add New Studio
                </Link>

                <Link
                  href="/my-listings"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Building2 size={18} />
                  My Studio Listings
                </Link>

                <Link
                  href="/my-bookings"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <CalendarDays size={18} />
                  My Bookings
                </Link>

                {/* Mobile Wishlist */}
                <Link
                  href="/wishlist"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive("/wishlist")
                      ? "bg-red-50 font-semibold text-red-600 dark:bg-red-950 dark:text-red-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`}
                >
                  <Heart size={18} className="text-red-500" />
                  My Wishlist
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (

              /* Mobile Logged Out */
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/signin"
                  onClick={closeMenus}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenus}
                  className="rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
