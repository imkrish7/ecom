"use client";
import { Spinner } from "@/components/ui/spinner";
import { me } from "@/services/userService";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useTransition,
} from "react";
import { toast } from "sonner";

export interface User {
  role: string;
  email: string;
  name: string;
}

export interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await me<User>();
        setUser(response);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isPending ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
