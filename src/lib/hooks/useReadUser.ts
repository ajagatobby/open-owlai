import {
  Session,
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

const useReadUser = () => {
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const supabase = useMemo(() => createClientComponentClient(), []);

  useEffect(() => {
    const fetchUserAndSession = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching data
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false); // Set loading state to false after data is fetched or an error occurs
      }
    };

    fetchUserAndSession();
  }, [supabase]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setLoading(false);
  };

  return { session, user, error, loading, signOut };
};

export default useReadUser;
