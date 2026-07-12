import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const { handleResendVerification } = useAuth();
  const [timer, setTimer] = useState(0);

   useEffect(() => {
     let interval;

     if (timer > 0) {
       interval = setInterval(() => {
         setTimer((prev) => prev - 1);
       }, 1000);
     }

     return () => clearInterval(interval);
   }, [timer]);

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      email,
    };

  await handleResendVerification(payload);
  
 if(success !== false) {
    setTimer(60);
    setEmail("");
  }
    // await handleResendVerification(payload);
  };

 

  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <h1 className="text-3xl font-bold text-[#31b8c6]">
            Resend Verification Email
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Already registered but didn't receive the verification email? Enter
            your email address below and we'll send you a new verification link.
          </p>

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email Address (if you haven't received the verification email
                wait 1 min and try again also check your spam folder)
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
              />
            </div>

            <button
              type="submit"
              disabled={timer > 0}
              className={`w-full rounded-lg px-4 py-3 font-semibold transition
    ${
      timer > 0
        ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
        : "bg-[#31b8c6] text-zinc-950 hover:bg-[#45c7d4]"
    }`}
            >
              {timer > 0
                ? `Resend available in ${timer}s`
                : "Resend Verification Email"}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-[#31b8c6]/20 bg-zinc-950/50 p-4">
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-[#31b8c6]">
                Didn't receive the email?
              </span>
              <br />
              Check your Spam, Promotions, or Updates folder before requesting a
              new verification email.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#31b8c6] hover:text-[#45c7d4]"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResendVerification;
