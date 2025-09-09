'use client';


import { Icon } from "@iconify/react";
import React from "react";

type InputGroupProps = {
  title: string;
  type?: string;
  placeholder?: string;
  icon: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputGroup({ title, type, placeholder, icon, value, onChange }: InputGroupProps) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  function showHidePassword(): void {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <div className="bg-[#ECECEC] p-4 rounded-[12px] flex justify-between items-center">
      <div className="flex justify-start gap-4 items-center w-full">
        <Icon fontSize={42} icon={icon} className="text-black" />
        <div className="flex flex-col w-full">
          <label className="text-[12px] text-[#49475A]">{title}</label>
          <input type={type === 'password' && passwordVisible ? 'text' : type} className="outline-none text-2xl font-bold placeholder:text-[#2F2F2F] placeholder:font-bold" placeholder={type === 'password' ? '*********' : placeholder} value={value} onChange={onChange} />
        </div>
      </div>
      {type === 'password' && <Icon fontSize={30} icon={passwordVisible ? "mdi:eye" : "mdi:eye-off"} onClick={() => showHidePassword()} className="text-black cursor-pointer" />}
    </div>
  );
}