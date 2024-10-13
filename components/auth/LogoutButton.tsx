"use client";

import { auth_logout } from "@/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleClick() {
        startTransition(async () => {
            const response = await auth_logout();

            if (response.success) {
                router.push("/");
            }
        });
    }


    return (
        <DropdownMenuItem onClick={handleClick}>
            {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
    )
}