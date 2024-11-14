"use client";

// import { loginWithCredentials } from "@/actions/auth";
import AuthButton from "../AuthButton";

export default function RegisterForm() {
  return (
    <div>
      <form
        // action={loginWithCredentials}
        className="w-full flex flex-col gap-4"
      >
        <div>
          <label>Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full rounded-lg border-2 border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            className="w-full rounded-lg border-2 border-gray-300 p-2"
          />
        </div>

        <AuthButton />
      </form>
    </div>
  );
}
