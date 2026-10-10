import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { verifyAdminCredentials } from "@/lib/firebase";

interface AdminLoginProps {
  onLoginSuccess: (adminName: string) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter both username/phone and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await verifyAdminCredentials(identifier, password);

      if (result.success) {
        const authPayload = {
          authenticated: true,
          username: result.username || identifier.trim(),
          authenticatedAt: new Date().toISOString(),
        };

        try {
          if (rememberMe) {
            localStorage.setItem("charla_admin_auth", JSON.stringify(authPayload));
          } else {
            sessionStorage.setItem("charla_admin_auth", JSON.stringify(authPayload));
          }
        } catch (storageErr) {
          console.warn("Storage write failed:", storageErr);
        }

        onLoginSuccess(result.username || identifier.trim());
      } else {
        setErrorMessage(result.error || "Invalid username/phone number or password.");
      }
    } catch (err: unknown) {
      console.error("Login verification error:", err);
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      {/* Background Ambience */}
      <div className="admin-login-glow admin-login-glow--top" aria-hidden="true" />
      <div className="admin-login-glow admin-login-glow--bottom" aria-hidden="true" />

      {/* Top Header / Back Nav */}
      <div className="admin-login-topbar">
        <button
          type="button"
          onClick={onNavigateHome}
          className="admin-login-back-btn"
          aria-label="Return to website"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>Back to Website</span>
        </button>
      </div>

      <div className="admin-login-container">
        <div className="admin-login-card">
          {/* Brand & Security Header */}
          <div className="admin-login-header">
            <div className="admin-login-brand">
              <img
                src="/assets/logo.png"
                alt="Charla Living"
                className="admin-login-logo"
                width={76}
                height={50}
              />
            </div>

            <div className="admin-login-badge">
              <ShieldCheck size={13} strokeWidth={2.4} />
              <span>Restricted Access</span>
            </div>

            <h1 className="admin-login-title">Admin Space</h1>
            <p className="admin-login-subtitle">
              Sign in with your administrator username or registered phone number to manage residences, availability, and leads.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="admin-login-error" role="alert">
              <AlertCircle size={18} strokeWidth={2.2} className="admin-login-error__icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
            <div className="admin-login-field">
              <label htmlFor="admin-identifier" className="admin-login-label">
                Username or Phone Number
              </label>
              <div className="admin-login-input-wrap">
                <span className="admin-login-input-icon" aria-hidden="true">
                  <User size={18} strokeWidth={2} />
                </span>
                <input
                  id="admin-identifier"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. admin or 8884446093"
                  className="admin-login-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password" className="admin-login-label">
                Password
              </label>
              <div className="admin-login-input-wrap">
                <span className="admin-login-input-icon" aria-hidden="true">
                  <Lock size={18} strokeWidth={2} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter admin password"
                  className="admin-login-input admin-login-input--password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-login-toggle-pw"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

            <div className="admin-login-options">
              <label className="admin-login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-login-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} strokeWidth={2.4} className="admin-login-spinner" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <Lock size={16} strokeWidth={2.2} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="admin-login-footer-note">
            <p>
              This console is exclusively for authorized Charla Living management and property staff. Access logs are recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
