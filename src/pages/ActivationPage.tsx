import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ActivationPage() {
  const navigate = useNavigate();

  const [preEmail, setPreEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("collect"); // "collect" | "otp"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // {type:"error"|"success", text:string}

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("email");
      if (stored) setPreEmail(stored);
    } catch {
      // ignore storage errors
    }
  }, []);

  const canRequestOtp = useMemo(() => {
    return Boolean(email && /.+@.+\..+/.test(email));
  }, [email]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const showMessage = (type, text) => setMessage({ type, text });

  async function handleGetOtp() {
    setMessage(null);
    if (!canRequestOtp) {
      showMessage("error", "Please enter a valid new email to receive the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/login/send_otp/${encodeURIComponent(email)}`, {
        method: "GET",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to send OTP (status ${res.status})`);
      }
      showMessage("success", "OTP sent to your new email. Please check your inbox.");
      setStep("otp");
    } catch (err) {
      showMessage("error", err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(e) {
    e.preventDefault();
    setMessage(null);

    if (!passwordsMatch) {
      showMessage("error", "Passwords do not match.");
      return;
    }
    if (!otp) {
      showMessage("error", "Please enter the OTP you received.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pre_email: preEmail,
        email: email,
        password: password,
        otp: otp,
      };

      const res = await fetch("http://127.0.0.1:8000/login/active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    //   const data = await res.json().catch(() => ({}));

      // Backend described as returning {"active"} on success, or {"detail":"Wrong"}
    //   const isActive = Object.prototype.hasOwnProperty.call(data, "active") || data?.status === "active";

      if (res.data === 'active') {
        showMessage("success", "Account activated successfully. Redirecting…");
        // brief delay to show success toast
        navigate('/sensor-data');
      } else {
        navigate('/login')
      }
    } catch (err) {
      showMessage("error", err.message || "Activation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Activate Your Account</h1>
          <p className="text-sm text-slate-500 mt-2">Securely update your email and activate access.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
          {message && (
            <div
              role="alert"
              className={
                "mb-4 rounded-xl border p-3 text-sm " +
                (message.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800")
              }
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-4">
            {/* Current Email (read-only from session storage) */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Current Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-600 border p-2"
                value={preEmail}
                onChange={() => {}}
                disabled
                placeholder="current@example.com"
              />
              <p className="mt-1 text-xs text-slate-500">Loaded from sessionStorage key: <span className="font-mono">email</span></p>
            </div>

            {/* New Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">New Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="new@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                {confirmPassword && (
                  <p
                    className={
                      "mt-1 text-xs " +
                      (passwordsMatch ? "text-emerald-600" : "text-red-600")
                    }
                  >
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            {/* Get OTP (visible only before step switch) */}
            {step === "collect" && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={!canRequestOtp || loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP…" : "Get OTP"}
                </button>
                <p className="mt-2 text-xs text-slate-500">OTP will be sent to your <span className="font-medium">New Email</span>.</p>
              </div>
            )}

            {/* OTP + Activate (visible after OTP requested) */}
            {step === "otp" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border p-2 tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    placeholder="Enter the 6-digit code"
                    maxLength={10}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-white font-medium shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Activating…" : "Activate Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("collect")}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 px-4 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-60"
                >
                  Back
                </button>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">Having trouble? Double‑check your email and spam folder for the OTP.</p>
      </div>
    </div>
  );
}
