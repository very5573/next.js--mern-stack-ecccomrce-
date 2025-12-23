"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

let isRedirecting = false;

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const { user, authChecked, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!authChecked) return;

    // ✅ safe access to pathname
    const path = router.pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");

    // ❌ Do not redirect public pages like /auth
    if (path.startsWith("/auth")) return;

    if (!isAuthenticated && !isRedirecting) {
      isRedirecting = true;
      router.replace("/auth");
    } else if (allowedRoles.length && !allowedRoles.includes(user?.role) && !isRedirecting) {
      isRedirecting = true;
      router.replace("/unauthorized");
    }
  }, [authChecked, isAuthenticated, user, allowedRoles, router]);

  if (!authChecked || loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", fontWeight: "bold", color: "#666" }}>
        ⏳ Checking authorization...
      </div>
    );
  }

  if (isAuthenticated && (!allowedRoles.length || allowedRoles.includes(user?.role))) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
