'use client';

import Input from "@/components/ui/Input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";
import toast from "react-hot-toast";

export default function Register() {
    const [firstName, setfirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [termsAccepted, setTermsAccepted] = React.useState(false);
    const router = useRouter();

    function registerHandler(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setIsSubmitting(true);

        if (firstName === "" || firstName.length < 4 || lastName === "" || lastName.length < 4 || email === "" || password === "" || !termsAccepted) {
            return;
        }

        api.post("/auth/register", {
            firstName,
            lastName,
            email,
            password,
        })
            .then(async (response) => {
                router.push("/");
                toast.success("Registration successful", { position: "bottom-center" });
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Registration failed", { position: "bottom-center" });
            });
    }

    return (
        <div className="h-screen flex items-center">
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-[130px] items-center">
                        <img src="/images/register.png" alt="Logo" className="w-[500px] h-fit" />
                        <form onSubmit={registerHandler} className="flex flex-col shadow-[0_0_4px_0_#00000014] p-16 rounded-[8px] bg-white w-full">
                            <div className="flex flex-col">
                                <h1 className="text-[36px]">Create an account</h1>
                            </div>
                            <div className="my-[40] mx-[40px]">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col">
                                        <Input value={firstName} onChange={(e) => setfirstName(e.target.value)} title="First Name" type="text" />
                                        {isSubmitting && firstName === "" && <span className="text-red-500 text-sm mt-1">First Name is required</span>}
                                        {isSubmitting && firstName.length < 4 && <span className="text-red-500 text-sm mt-1">First Name must be at least 3 characters</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} title="Last Name" type="text" />
                                        {isSubmitting && lastName === "" && <span className="text-red-500 text-sm mt-1">Last Name is required</span>}
                                        {isSubmitting && lastName.length < 4 && <span className="text-red-500 text-sm mt-1">Last Name must be at least 3 characters</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <Input value={email} onChange={(e) => setEmail(e.target.value)} title="Email" type="email" />
                                        {isSubmitting && email === "" && <span className="text-red-500 text-sm mt-1">Email is required</span>}
                                    </div>
                                    <div className="flex flex-col">
                                        <Input value={password} onChange={(e) => setPassword(e.target.value)} title="Password" type="password" />
                                        {isSubmitting && password === "" && <span className="text-red-500 text-sm mt-1">Password is required</span>}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex items-start gap-2 mt-4">
                                        <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 accent-indigo-500 mt-[2px]" />
                                        <label htmlFor="terms" className={ isSubmitting ? "text-red-500" : "text-[#686677]" }>By creating an account, I agree to our <a className="text-[#19181F] underline" href="Terms of use">Terms of use</a> and <a className="text-[#19181F] underline" href="Privacy Policy">Privacy Policy</a> </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button type="submit" className="bg-indigo-500 text-white w-full h-[56px] rounded-[12px] font-bold text-[20px] hover:bg-indigo-600 transition duration-300">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
