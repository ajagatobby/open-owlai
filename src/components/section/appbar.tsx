"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  Briefcase,
  Globe,
  Home,
  User,
  Mail,
  LogOut,
  Sparkles,
  Menu,
  X,
  Package,
} from "lucide-react";
import Container from "@/components/section/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useReadUser from "@/lib/hooks/useReadUser";
import { useRealtimeUser } from "@/lib/hooks/useRealtimeUser";
import { useRealtimeSubscription } from "@/lib/hooks/useRealtimeSubscription";
import { Subscription } from "@prisma/client";
import SickUpgradeButton from "../ui/slick-button";
import UltraPremiumCreditsButton from "../ui/credit-button";
import SignInButton from "../ui/signin-button";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

type UserData = {
  id: string;
  fullname: string | null;
  avatarUrl: string | null;
  username: string | null;
  email: string;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  freeCredit: number;
  subscriptionId: string | null;
} | null;

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Bookmark, label: "Saved Logos", href: "/saved-logos" },
  { icon: Briefcase, label: "My Logos", href: "/mylogos" },
  { icon: Globe, label: "Community", href: "/community" },
  { icon: Package, label: "Pricing", href: "/settings" },
];

const publicNavItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Globe, label: "Community", href: "/community" },
  { icon: Package, label: "Pricing", href: "/pricing" },
];

const Logo: React.FC = () => (
  <Link href="/">
    <motion.div
      className="flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src="/assets/owlai.png" alt="Owl AI logo" className="h-8 md:h-12" />
      <h1 className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        Owlai
      </h1>
    </motion.div>
  </Link>
);

const NavButton: React.FC<NavItem & { isActive: boolean }> = ({
  icon: Icon,
  label,
  href,
  isActive,
}) => (
  <Link href={href}>
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        className={`text-gray-700 transition-colors duration-200 ${
          isActive
            ? "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800"
            : "hover:text-purple-500"
        }`}
      >
        <Icon className={`w-5 h-5 mr-2 ${isActive ? "text-purple-700" : ""}`} />
        <span>{label}</span>
      </Button>
    </motion.div>
  </Link>
);

const UserMenu: React.FC<{
  userData: UserData;
  subscription: Subscription | null;
  handleLogout: () => void;
}> = ({ userData, subscription, handleLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Avatar className="cursor-pointer border-2 border-purple-500">
          <AvatarImage
            src={userData?.avatarUrl || ""}
            alt={`${userData?.fullname}'s avatar`}
          />
          <AvatarFallback>
            {userData?.email.slice(0, 2).toUpperCase() || "OW"}
          </AvatarFallback>
        </Avatar>
      </motion.div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
      <DropdownMenuLabel className="font-semibold text-gray-700">
        {userData?.username}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex items-center text-gray-600 hover:text-purple-500 transition-colors duration-200">
        <Mail className="mr-2 h-4 w-4" />
        <span>{userData?.email || ""}</span>
      </DropdownMenuItem>
      <Link href="/settings">
        <DropdownMenuItem className="flex items-center text-gray-600 hover:text-purple-500 transition-colors duration-200">
          <User className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </Link>
      <DropdownMenuItem className="flex items-center text-gray-600 hover:text-purple-500 transition-colors duration-200">
        <Sparkles className="mr-2 h-4 w-4" />
        <span>
          {subscription?.status === "active"
            ? subscription.credits
            : userData?.freeCredit}{" "}
          credits
        </span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleLogout}
        className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  pathname: string;
}> = ({ isOpen, onClose, navItems, pathname }) => (
  <motion.div
    initial={{ opacity: 0, x: "100%" }}
    animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "100%" }}
    transition={{ duration: 0.3 }}
    className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 ${
      isOpen ? "block" : "hidden"
    }`}
  >
    <div className="p-4">
      <button onClick={onClose} className="mb-4">
        <X className="w-6 h-6 text-gray-600" />
      </button>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavButton
            key={item.label}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </div>
  </motion.div>
);

const AppBar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { session, loading, user } = useReadUser();
  const { user: supabaseUser } = useRealtimeUser(user?.id ?? "");
  const { subscription } = useRealtimeSubscription(user?.id ?? "");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to sign out. Please try again.");
      } else {
        router.push("/signin");
        toast.success("You have been signed out successfully.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const currentNavItems = session ? navItems : publicNavItems;

  return (
    <motion.header
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="w-full py-4 bg-white flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2">
          {currentNavItems.map((item) => (
            <NavButton
              key={item.label}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          {session ? (
            <>
              {subscription?.status === "active" || supabaseUser?.freeCredit ? (
                <UltraPremiumCreditsButton
                  credits={
                    (subscription?.status === "active"
                      ? subscription.credits
                      : 0) ||
                    supabaseUser?.freeCredit ||
                    0
                  }
                />
              ) : (
                <Link href="/settings">
                  <SickUpgradeButton />
                </Link>
              )}
              <UserMenu
                handleLogout={handleLogout}
                userData={supabaseUser}
                subscription={subscription}
              />
            </>
          ) : (
            <Link href="/signin">
              <SignInButton />
            </Link>
          )}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </Button>
        </div>
      </Container>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={currentNavItems}
        pathname={pathname}
      />
    </motion.header>
  );
};

export default AppBar;
