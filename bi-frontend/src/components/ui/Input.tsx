'use client';

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

type InputProps = {
  title: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ title, type, value, onChange }: InputProps) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  function showHidePassword(): void {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[20px] text-[#49475A] font-bold">{title}</label>
      <div className="relative">
        <input type={type === 'password' ? (passwordVisible ? "text" : "password") : type} value={value} onChange={onChange} className="border border-[#CBCAD7] w-full p-2 outline-indigo-500 rounded-[12px] outline-none text-2xl font-bold placeholder:text-[#2F2F2F] placeholder:font-bold" />
        <Icon fontSize={24} icon={type === 'password' ? (passwordVisible ? "mdi:eye" : "mdi:eye-off") : ""} onClick={() => showHidePassword()} className={`text-black cursor-pointer absolute top-1/2 right-4 -translate-y-1/2 ${type !== 'password' ? 'hidden' : ''}`} />
      </div>
    </div>
  );
}