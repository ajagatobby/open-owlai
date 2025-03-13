"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useReadUser from "@/lib/hooks/useReadUser";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom easing function for a "genius" feel
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const SignInLayout: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"google" | "magic" | null>(
    null
  );
  const [signIn, setSignIn] = useState(true);
  const supabase = createSupabaseBrowserClient();
  const { session } = useReadUser();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setActiveMethod("google");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error("Error signing in with Google");
        console.error("Error during Google Sign-In:", error);
      } else if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      toast.error("Error signing in with Google");
      console.error("Exception during Google Sign-In:", error);
    } finally {
      setIsLoading(false);
      setActiveMethod(null);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    setActiveMethod("magic");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: !signIn,
        },
      });

      if (error) {
        toast.error("Error signing in with email");
        console.error("Error signing in with email:", error);
      } else {
        toast.success("Check your inbox or spam folder for the magic link");
        setEmail("");
      }
    } catch (error) {
      toast.error("Error signing in with email");
      console.error("Exception during email Sign-In:", error);
    } finally {
      setIsLoading(false);
      setActiveMethod(null);
    }
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.h2
              key={signIn ? "signin" : "signup"}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-3xl font-bold text-center text-gray-800 mb-2"
            >
              {signIn ? "Welcome Back!" : "Join the Community"}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={signIn ? "signin-desc" : "signup-desc"}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center text-gray-600 mb-8"
            >
              {signIn
                ? "Yo, let's get you signed in"
                : "Start your journey to incredible possibilities"}
            </motion.p>
          </AnimatePresence>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 font-medium transition duration-300 ${
                activeMethod === "google" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="w-6 h-6 mr-3" />
              {isLoading && activeMethod === "google" ? (
                <motion.div
                  className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                `Continue with Google`
              )}
            </motion.button>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-3 px-10 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium transition duration-300 ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:from-purple-700 hover:to-indigo-700"
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading && activeMethod === "magic" ? (
                  <motion.div
                    className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  <span className="flex items-center justify-center">
                    {signIn ? "Send Magic Link" : "Create Account"}
                    <FiArrowRight className="ml-2" />
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white"
        >
          <AnimatePresence mode="wait">
            <motion.h3
              key={signIn ? "signin-cta" : "signup-cta"}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-xl font-semibold mb-2"
            >
              {signIn ? "New to our platform?" : "Already have an account?"}
            </motion.h3>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={signIn ? "signin-cta-desc" : "signup-cta-desc"}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-4"
            >
              {signIn
                ? "Join us and discover a world of possibilities!"
                : "Sign in to continue your amazing journey"}
            </motion.p>
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-2 px-4 bg-white text-purple-600 rounded-lg font-medium transition duration-300 hover:bg-gray-100"
            onClick={() => setSignIn(!signIn)}
          >
            {signIn ? "Create an Account" : "Sign In"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInLayout;
