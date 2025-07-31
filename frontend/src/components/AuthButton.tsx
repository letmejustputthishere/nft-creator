import { useInternetIdentity } from "ic-use-internet-identity";
import { LogIn, LogOut, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function AuthButton() {
    const { identity, login, clear } = useInternetIdentity();
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    const copyPrincipal = async () => {
        if (!identity) return;

        try {
            const principal = identity.getPrincipal().toString();
            await navigator.clipboard.writeText(principal);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error("Failed to copy principal:", error);
        }
    };

    const handleLogout = async () => {
        // Clear all queries before logging out
        queryClient.clear();
        // Clear the identity
        await clear();
        // Force a page reload to ensure clean state
        window.location.reload();
    };

    if (identity) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={copyPrincipal}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer group"
                    title="Click to copy full principal"
                >
                    <User className="w-4 h-4" />
                    <span className="font-mono">
                        {identity.getPrincipal().toString().slice(0, 8)}...
                    </span>
                    {copied ? (
                        <Check className="w-3 h-3 text-green-400" />
                    ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
                {copied && (
                    <span className="text-xs text-green-400 animate-fade-in">
                        Copied!
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={login}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
        >
            <LogIn className="w-4 h-4" />
            Login with Internet Identity
        </button>
    );
}
