import Link from "next/link";
import { useRouter } from "next/router";
import { Plane, BarChart2, MessageCircle, Package } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/",         label: "Home",      icon: Plane },
  { href: "/predict",  label: "Predict",   icon: BarChart2 },
  { href: "/packages", label: "Packages",  icon: Package },
  { href: "/chat",     label: "AI Chat",   icon: MessageCircle },
];

export default function Navbar() {
  const { pathname } = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Plane size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-ocean-dark">
            Work<span className="text-sand-dark">ation</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === href
                  ? "bg-ocean text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-ocean"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
