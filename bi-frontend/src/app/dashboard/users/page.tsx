'use client';

import Input from "@/components/ui/Input";
import Modal from "@/components/widget/Modal";
import { Icon } from "@iconify/react/dist/iconify.js"
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect } from "react";
import Cookies from 'js-cookie';
import { toast } from "react-hot-toast";
import api from "@/lib/api";

type User = {
    id: number,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
};

export default function Users() {
    const [id, setId] = React.useState<number | string>("");
    const [firstName, setfirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [users, setUsers] = React.useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = React.useState(false);
    const router = useRouter();
    const [token, setToken] = React.useState('');
    const [user, setUser] = React.useState<User | null>(null);
    const [search, setSearch] = React.useState<string>('');
    const [role, setRole] = React.useState<string>('');
    const [page] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [sort] = React.useState('id');
    const [order] = React.useState('ASC');
    const [pagination, setPagination] = React.useState({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10
    });

    function logout() {
        Cookies.remove("token");
        toast.success("Logout successful", { position: "bottom-center" });
        router.push("/");
    }

    function requestFormReset() {
        setId('');
        setfirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    }

    function deleteUser(id: number | string) {
        api.delete(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                setIsModalOpenDelete(false)
                initData()
                toast.success("Delete users successful", { position: "bottom-center" });
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Delete users failed", { position: "bottom-center" });
            });
    }

    function userHandler(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setIsSubmitting(true);

        if (firstName === "" || firstName.length < 4 || lastName === "" || lastName.length < 4 || email === "" || password === "") {
            return;
        }

        const path = id ? `/users/${id}` : `/users`
        const request = api.request({
            url: path,
            method: id ? 'PUT' : 'POST',
            data: {
                id,
                firstName,
                lastName,
                email,
                password,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        request.then(async (response) => {
            initData();
            setIsModalOpen(false);
            requestFormReset();
            toast.success(id ? `Add users successful` : `Update users successful`, { position: "bottom-center" });
        })
            .catch((error) => {
                toast.error(error.response?.data?.message || id ? `Add users failed` : `Update users failed`, { position: "bottom-center" });
            });
    }

    function initData(role: string = '', search: string = '') {
        api.get("/users", {
            params: {
                page: page,
                limit: limit,
                sort: sort,
                order: order,
                search: search,
                role: role
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setUsers(response.data.data);
                setPagination(response.data.meta);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const token = Cookies.get("token");
        setToken(token || '');
        const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
        setUser(userData);
    }, [router]);

    useEffect(() => {
        if (!token) return;
        initData();
    }, [token, user]);

    useEffect(() => {
        // kalau query kosong, jangan fetch
        if (!search) {
            initData(role, search);
            return;
        }

        const timer = setTimeout(() => {
            initData(role, search);
        }, 800); // delay 800ms

        return () => clearTimeout(timer); // cancel kalau user masih mengetik
    }, [search]);

    function handlePageChange(page: number): void {
        if (page < 1 || page > pagination.totalPages) return;
        setPagination((prev) => ({ ...prev, page }));
        initData();
    }

    return (
        <div className="flex gap-8">

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create an account">
                <div className="my-[40] mx-[40px]">
                    <form onSubmit={userHandler} className="flex flex-col rounded-[8px] bg-white w-full">
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
                        </div>
                        <div className="mt-8">
                            <button type="submit" className="bg-indigo-500 text-white w-full h-[56px] rounded-[12px] font-bold text-[20px] hover:bg-indigo-600 transition duration-300">{id ? 'Update' : 'Save'}</button>
                        </div>
                    </form>

                </div>
            </Modal>

            <Modal isOpen={isModalOpenDelete} onClose={() => setIsModalOpenDelete(false)} title="Konfirmasi">
                <div className="my-[40] mx-[40px] flex justify-center flex-col items-center gap-4">
                    <h2 className="text-[24px]">Are you sure you want to delete data?</h2>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => deleteUser(id)} className="bg-indigo-500 text-white w-[80px] px-2 h-[56px] rounded-[12px] font-bold text-[20px] hover:bg-indigo-600 transition duration-300">OK</button>
                        <button type="button" onClick={() => setIsModalOpenDelete(false)} className="bg-indigo-500 text-white w-[80px] px-2 h-[56px] rounded-[12px] font-bold text-[20px] hover:bg-indigo-600 transition duration-300">Cancel</button>

                    </div>
                </div>
            </Modal>

            <div className="flex flex-col h-screen bg-[#F2EAE1] p-4 gap-[80px] items-center justify-between">
                <div className="flex flex-col gap-12">
                    <div className="flex w-[270px] gap-2">
                        <div className="w-[4px] h-[30px] bg-[#F8D442]"></div>
                        <h1 className="text-[20px] font-bold font-montserrat">CRUD OPERATIONS</h1>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <img src="/images/people.png" className="w-32 h-40 rounded-[50%] object-cover" alt="" />
                        <h2 className="text-[17px] font-bold font-montserrat">{user?.firstName} {user?.lastName}</h2>
                        <h3 className="text-[#893976] font-medium font-montserrat capitalize">{user?.role}</h3>
                        <button className="bg-[#AA80F9] w-full flex items-center justify-center gap-3 h-[38px] rounded-[4px]  hover:bg-indigo-600 transition duration-300 mt-18">
                            <Icon icon="mdi:home-outline" fontSize={24} className="text-black" />
                            <span className="font-bold text-[20px] text-black ">Home</span>
                        </button>
                    </div>
                </div>
                <button onClick={() => logout()} className="flex cursor-pointer items-center gap-2 mb-16">
                    <span className="font-bold text-black ">Logout</span>
                    <Icon icon="mdi:logout" fontSize={24} className="text-black" />
                </button>
            </div>
            <div className="flex w-full flex-col py-4 gap-8 mr-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-[22px] font-bold">User List</h1>
                    <button onClick={() => { requestFormReset(), setIsModalOpen(true) }} className="bg-[#6358DC] cursor-pointer text-white w-fit px-8 py-4 rounded-[4px] font-bold transition duration-300">ADD USER</button>
                </div>
                <div className="flex bg-white p-2 rounded-[4px] gap-2">
                    <select value={role} onChange={(e) => { setRole(e.target.value), initData(e.target.value, search)}} className="rounded-md py-2 px-4 w-[150px] outline-none">
                        <option value="">All</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <div className="relative w-full">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="rounded-md py-2 px-4 pl-10 w-full outline-none" placeholder="Search for a student by name or email" />
                        <Icon icon="mdi:magnify" fontSize={24} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#ACACAC]" />
                    </div>
                </div>
                <div className="border-b border-[#E5E5E5]"></div>
                <div className="mt-[-20px]">
                    <div className="grid grid-cols-6 px-4 py-2 text-sm font-medium text-[#ACACAC]">
                        <div>First Name</div>
                        <div>Last Name</div>
                        <div>Role</div>
                        <div>Email</div>
                        <div>Password</div>
                        <div>Action</div>
                    </div>
                    <div className="space-y-3">
                        { users.length > 0 ? users.map((user, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-6 items-center rounded-lg bg-white px-4 py-5 shadow-1xl hover:shadow-sm transition duration-300 cursor-pointer"
                            >
                                <div>{user.firstName}</div>
                                <div>{user.lastName}</div>
                                <div className="capitalize">{user.role}</div>
                                <div>{user.email}</div>
                                <div>*******</div>
                                <div className="flex space-x-3">
                                    <Icon onClick={() => { setId(user.id), setfirstName(user.firstName), setLastName(user.lastName), setEmail(user.email), setPassword(''), setIsModalOpen(true) }} icon="mdi:pencil-outline" fontSize={24} className="text-[#893976] cursor-pointer" />
                                    <Icon onClick={() => { setId(user.id), setIsModalOpenDelete(true) }} icon="mdi:delete-outline" fontSize={24} className="text-[#893976] cursor-pointer" />
                                </div>
                            </div>
                        )) : <div className="text-center col-span-6 py-10">No users found</div> }
                    </div>
                    <div className="flex gap-2 justify-end items-center mt-4">
                        <div className="flex gap-2">
                            <button onClick={() => handlePageChange(pagination.page - 1)} className="h-[28px] w-[28px] rounded-md bg-white text-black font-bold border cursor-pointer border-[#E5E5E5]">
                                <Icon icon="mdi:chevron-left" fontSize={20} />
                            </button>
                            {pagination.totalPages > 0 && Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button onClick={() => handlePageChange(i + 1)} key={i} className={`h-[28px] w-[28px] rounded-md ${pagination.page === i + 1 ? 'border border-[#6358DC] text-[#6358DC] font-bold' : 'bg-white text-black cursor-pointer border border-[#E5E5E5]'}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(pagination.page + 1)} className="h-[28px] w-[28px] rounded-md bg-white text-black cursor-pointer border border-[#E5E5E5]">
                                <Icon icon="mdi:chevron-right" fontSize={20} />
                            </button>
                        </div>
                        <select className="h-[28px] outline-none rounded-md bg-white text-black font-bold border cursor-pointer border-[#E5E5E5]" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); handlePageChange(1); }}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
