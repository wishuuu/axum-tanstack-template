import * as React from "react";
import { createRoute, type AnyRoute, Link } from "@tanstack/react-router";
import useLoginStore from "@/routes/login/login.store";

function LoginScreenComponent() {
  const { data, setValue, submit, error, isLoading, init } = useLoginStore();
  React.useEffect(() => {
    init();
  }, [init]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-3xl flex-row shadow-2xl border border-base-200 overflow-hidden">
        {/* Image section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-base-200 w-1/2 p-8">
          <h2 className="mt-6 text-2xl font-bold text-primary">Welcome to project_name!</h2>
        </div>
        {/* Form section */}
        <div className="flex-1 flex flex-col justify-center p-8 bg-base-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-primary">Welcome Back</h1>
            <p className="text-base-content/70 mt-2">Sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={submit}>
            <div>
              <label className="label" htmlFor="email">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="input input-bordered w-full input-primary"
                value={data.username}
                onChange={(e) => setValue("username", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full input-primary"
                value={data.password}
                onChange={(e) => setValue("password", e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="alert alert-error shadow-sm text-sm py-2 px-3">{error}</div>}

            <button type="submit" className="btn btn-primary w-full font-bold text-lg" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>
          </form>

          <div className="divider my-6">OR</div>

          <div className="flex flex-col gap-2 text-center">
            <Link to="/" className="link link-primary text-sm">
              Forgot password?
            </Link>
            <span className="text-sm text-base-content/60">
              Don't have an account?{" "}
              <Link to="/" className="link link-primary">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LoginScreen = (parentRoute: AnyRoute) =>
  createRoute({
    path: "login",
    component: LoginScreenComponent,
    getParentRoute: () => parentRoute,
  });
