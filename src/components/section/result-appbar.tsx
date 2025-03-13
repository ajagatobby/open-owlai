"use client";
import React from "react";
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
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Container from "@/components/section/container";

import Link from "next/link";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const Logo: React.FC = () => (
  <motion.div
    className="flex items-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link href="/">
      <Button
        variant={"outline"}
        className={`text-gray-700 bg-transparent transition-colors duration-200 `}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
    </Link>
  </motion.div>
);

const ResultAppBar: React.FC = () => {
  return (
    <motion.header
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="w-full py-4 bg-white flex items-center justify-between">
        <Logo />
        <h3 className="text-black text-2xl font-medium">Your logo is ready</h3>
        <div />
      </Container>
    </motion.header>
  );
};

export default ResultAppBar;
