"use client";
import { auth_reset_perform, auth_reset_request, auth_reset_verify } from "@/actions/auth";
import OTPField from "@/components/auth/OTPField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Recovery() {
    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [token, setToken] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [state, setState] = useState<"email" | "otp" | "password">("email");

    const router = useRouter();
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);

        startTransition(async () => {
            try {
                let result;

                if (state === "email") {
                    if (email.length == 0) {
                        setError("Email is required");
                        return;
                    }

                    result = await auth_reset_request(email);
                }

                if (state === "otp") {
                    if (otp.length === 0) {
                        setError("OTP is required");
                        return;
                    }

                    result = await auth_reset_verify(email, otp);
                }

                if (state === "password") {
                    if (password.length === 0) {
                        setError("Password is required");
                        return;
                    }

                    if (password !== password2) {
                        setError("Passwords do not match");
                        return;
                    }

                    if (token.length == 0) {
                        setError("Token is required");
                        return;
                    }

                    result = await auth_reset_perform(email, password, token);
                }

                if (result?.success) {
                    if (result.data?.message) {
                        toast({
                            description: result.data.message,
                        });
                    }

                    if (state === "email") {
                        setState("otp");
                    }

                    if (state === "otp") {
                        if (result?.data?.data?.token) {
                            setToken(result.data.data.token);
                        }

                        setState("password");
                    }

                    if (state === "password") {
                        router.push("/");
                    }
                } else {
                    setError(result?.error || "An error occurred");
                }
            } catch (error) {
                setError("An error occurred");
            }
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center h-full py-12">
            <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Recover Account</h1>
                    <p className="text-balance text-muted-foreground">
                        {(() => {
                            if (state === "email") {
                                return "Enter your email below to recover your account";
                            }

                            if (state === "otp") {
                                return "Enter the OTP sent to your email below";
                            }

                            return "Enter your new password below";
                        })()}
                    </p>
                </div>
                <div className="grid gap-4">
                    {error && <p className="text-red-500">{error}</p>}
                    {state === "email" && (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={state !== "email"}
                            />
                        </div>
                    )}

                    {state === "otp" && (
                        <div className="flex items-center justify-center gap-2 flex-col">
                            <OTPField value={otp} setValue={setOTP} />
                        </div>
                    )}

                    {state === "password" && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {state === "password" && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password2}
                                placeholder="********"
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
