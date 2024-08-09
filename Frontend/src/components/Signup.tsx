"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../../lib/utils";
import { useRouter } from "next/router";

const Signup: React.FC = () => {
    const [fullname, setFullname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const router = useRouter();

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://study-sphere-b.vercel.app/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    fullname: fullname,
                    email: email,
                    username: username,
                    password: password,
                    country: country,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Registered Successfully.');
                router.push('/signin');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert(error);
        }
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-black mt-[75px]">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Register 
      </h2>

      <form className="my-8" onSubmit={handleSignup}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="fullname">Full Name</Label>
            <Input placeholder="Virat" type="text" value={fullname} onChange={handleChange(setFullname)} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input placeholder="vk18@gmail.com" type="email" value={email} onChange={handleChange(setEmail)}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input placeholder="King" type="text" value={username} onChange={handleChange(setUsername)} />
          </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={password} onChange={handleChange(setPassword)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="India"
            type="text"
            value={country}
            onChange={handleChange(setCountry)}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
export default Signup