'use client';

import InputGroup from "@/components/ui/InputGroup";
import api from "@/lib/api";
import { authStore } from "@/lib/authStore";
import Link from "next/link";
import React, { FormEvent } from "react";
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setUser, setIsLogin } = authStore();
  const router = useRouter();

  function loginHandler(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setIsSubmitting(true);

    if (email === "" || password === "") {
      return;
    }
    
    api.post("/auth/login", {
      email,
      password,
      rememberMe,
    })
      .then(async (response) => {
        setUser(response.data.user);
        setIsLogin(true);
        Cookies.set('token', response.data.token, { expires: response.data.expiresIn, secure: true, sameSite: 'strict' });
        Cookies.set('user', JSON.stringify(response.data.user), { expires: response.data.expiresIn, secure: true, sameSite: 'strict' });
        router.push("/dashboard/users");
        toast.success("Login successful", { position: "bottom-center" });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed", { position: "bottom-center" });
      });
  }

  return (
    <div className="h-screen flex items-center">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-[130px] items-center">
            <img src="/images/login.png" alt="Logo" className="w-[500px] h-fit" />
            <div className="flex flex-col shadow-[0_0_4px_0_#00000014] p-16 rounded-[8px] bg-white w-full">
              <div className="flex flex-col">
                <span className="text-[36px]">Welcome to</span>
                <h1 className="text-[#6358DC] text-[46px] font-[900]">BIGFORUM</h1>
              </div>
              <form onSubmit={loginHandler} className="my-[100]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <InputGroup value={email} onChange={(e) => setEmail(e.target.value)} icon="mdi:email" title="Email" placeholder="example@gmail.com" type="email" />
                    {isSubmitting && email === "" && <span className="text-red-500 text-sm mt-1">Email is required</span>}
                  </div>
                  <div className="flex flex-col">
                    <InputGroup value={password} onChange={(e) => setPassword(e.target.value)} icon="mdi:lock" title="Password" type="password" />
                    {isSubmitting && password === "" && <span className="text-red-500 text-sm mt-1">Password is required</span>}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center gap-2 mt-4">
                    <input id="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" className="w-4 h-4 accent-indigo-500" />
                    <label htmlFor="remember-me" className="text-[16px]">Remember me</label>
                  </div>
                  <a href="#" className="text-[16px] text-indigo-500 ml-auto mt-4 hover:underline">Forgot Password?</a>
                </div>
                <div className="mt-8">
                  <button type="submit" className="bg-indigo-500 text-white w-full h-[56px] rounded-[12px] font-bold text-[20px] hover:bg-indigo-600 transition duration-300">Login</button>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[20px]">Don't have an account? <Link href="/register" className="text-indigo-500 hover:underline">Register</Link></span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
