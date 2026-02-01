import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, AuthUser, setAuthToken, getAuthToken } from "@/lib/api";

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthUser>;
    register: (data: {
        email: string;
        password: string;
        name: string;
        role: string;
        organizationName?: string;
    }) => Promise<AuthUser>;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const { user } = await authApi.me();
                    setUser(user);
                    // Sync to localStorage for backward compatibility
                    localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
                } catch {
                    // Token invalid, clear it
                    setAuthToken(null);
                    localStorage.removeItem("user");
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { user } = await authApi.login(email, password);
        setUser(user);
        // Sync to localStorage for backward compatibility with Navbar
        localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
        window.dispatchEvent(new Event("auth-change"));
        return user;
    };

    const register = async (data: {
        email: string;
        password: string;
        name: string;
        role: string;
        organizationName?: string;
    }) => {
        const { user } = await authApi.register(data);
        setUser(user);
        // Sync to localStorage for backward compatibility
        localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
        window.dispatchEvent(new Event("auth-change"));
        return user;
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        window.dispatchEvent(new Event("auth-change"));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
