import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronDown,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

import { useApp } from "@/lib/AppContext";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 21.99c2.63 0 4.84-.87 6.46-2.37l-3.14-2.43c-.87.58-1.98.92-3.32.92-2.55 0-4.71-1.72-5.49-4.04H3.27v2.51A9.75 9.75 0 0 0 12 21.99Z"
      />
      <path
        fill="#FBBC05"
        d="M6.51 14.07A5.86 5.86 0 0 1 6.2 12c0-.72.12-1.42.31-2.07V7.42H3.27A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.58l3.24-2.51Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.89c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.95 14.63 2 12 2a9.75 9.75 0 0 0-8.73 5.42l3.24 2.51C7.29 7.61 9.45 5.89 12 5.89Z"
      />
    </svg>
  );
}

function SignInModal({ onClose, onGoogle, onPersona }) {
  const [selectedPersona, setSelectedPersona] =
    useState("CUSTOMER");

  const choosePersona = (role) => {
    setSelectedPersona(role);
    onPersona(role);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-purple-400/30 bg-[#0d0b14] p-8 shadow-2xl shadow-purple-900/40">

        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>

          <h2 className="text-center font-serif text-3xl italic text-purple-300">
            Galerie
          </h2>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Enter the world of curated objects, art and design.
          </p>

          <button
            onClick={() => onGoogle(selectedPersona)}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Sign in as
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["CUSTOMER", "Customer"],
              ["VENDOR", "Vendor"],
              ["ADMIN", "Admin"],
            ].map(([role, label]) => (
              <button
                key={role}
                onClick={() => choosePersona(role)}
                className={cn(
                  "rounded-full border px-3 py-3 text-sm font-medium transition",
                  selectedPersona === role
                    ? "border-purple-400/60 bg-purple-500/15 text-purple-200"
                    : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/5"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { cartCount } = useApp();

  const {
    user,
    activeRole,
    setPersona,
    navigateToLogin,
    logout,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [signInOpen, setSignInOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = activeRole;

  const navItems =
    role === "CUSTOMER"
      ? [
          { label: "Home", path: "/" },
          { label: "Explore", path: "/shop" },
          { label: "Orders", path: "/orders" },
        ]
      : role === "VENDOR"
        ? [
            { label: "Studio", path: "/studio" },
            { label: "Products", path: "/studio/products" },
            { label: "Orders", path: "/studio/orders" },
            { label: "Intelligence", path: "/studio/intelligence" },
          ]
        : role === "ADMIN"
          ? [
              { label: "Overview", path: "/admin" },
              { label: "Users", path: "/admin/users" },
              { label: "Vendors", path: "/admin/vendors" },
              { label: "Intelligence", path: "/admin/intelligence" },
            ]
          : [
              { label: "Explore", path: "/shop" },
              { label: "About", path: "/about" },
            ];

  const handleGoogleLogin = (persona) => {
    setPersona(persona);
    setSignInOpen(false);
    navigateToLogin();
  };

  const handlePersona = (persona) => {
    /*
     * If already logged in, switch immediately.
     * If not logged in, remember the selected persona.
     */
    setPersona(persona);

    if (user) {
      if (persona === "CUSTOMER") {
        navigate("/");
      } else if (persona === "VENDOR") {
        navigate("/studio");
      } else if (persona === "ADMIN") {
        navigate("/admin");
      }

      setSignInOpen(false);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const getInitial = () => {
    return (
      user?.name?.charAt(0) ||
      user?.email?.charAt(0) ||
      "U"
    ).toUpperCase();
  };

  return (
    <>
      {/* Floating navbar */}
      <div className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <header className="rounded-full border border-white/10 bg-background/80 shadow-xl backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">

            <Link
              to="/"
              className="flex shrink-0 items-center"
              onClick={() => setUserMenuOpen(false)}
            >
              <Logo />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition",
                    isActive(item.path)
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {role === "CUSTOMER" && (
                <Link
                  to="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-white/10"
                >
                  <ShoppingBag className="h-5 w-5" />

                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative z-[60]">
                  <button
                    onClick={() =>
                      setUserMenuOpen((v) => !v)
                    }
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 hover:bg-white/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {getInitial()}
                    </div>

                    <div className="hidden text-left sm:block">
                      <div className="max-w-[120px] truncate text-sm font-medium">
                        {user.name || "User"}
                      </div>

                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {role}
                      </div>
                    </div>

                    <ChevronDown className="hidden h-4 w-4 sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-60 rounded-2xl border border-white/10 bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
                      <div className="border-b border-white/10 px-3 py-3">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-purple-400">
                          Current: {role}
                        </p>

                        {user.realRole && (
                          <p className="mt-1 text-[9px] text-muted-foreground">
                            Account role: {user.realRole}
                          </p>
                        )}
                      </div>

                      {/* Quick persona switch */}
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {["CUSTOMER", "VENDOR", "ADMIN"].map(
                          (persona) => (
                            <button
                              key={persona}
                              onClick={() =>
                                handlePersona(persona)
                              }
                              className={cn(
                                "rounded-lg px-1 py-2 text-[9px] transition",
                                role === persona
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "hover:bg-white/10"
                              )}
                            >
                              {persona}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSignInOpen(true)}
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 px-4 pb-2 md:hidden">
            <nav className="flex gap-1 overflow-x-auto pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                    isActive(item.path)
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      </div>

      {signInOpen && (
        <SignInModal
          onClose={() => setSignInOpen(false)}
          onGoogle={handleGoogleLogin}
          onPersona={handlePersona}
        />
      )}

      {userMenuOpen && (
        <button
          className="fixed inset-0 z-40"
          aria-label="Close menu"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}