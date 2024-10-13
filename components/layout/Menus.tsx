import { Home, Package2, Users } from 'lucide-react';
import Link from 'next/link';
import PermissionChecker from '../auth/PermissionChecker';
import MenuItem from './MenuItem';

export function DesktopMenus() {
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <MenuItem href="/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
            </MenuItem>

            <PermissionChecker capabilities={['manage-users']}>
                <MenuItem href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    Users
                </MenuItem>
            </PermissionChecker>
        </nav>
    );
}

export function MobileMenus() {
    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
            >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">XPRESS CMS</span>
            </Link>
            <MenuItem href="/dashboard" type="mobile">
                <Home className="h-4 w-4" />
                Dashboard
            </MenuItem>

            <MenuItem href="/dashboard/users" type="mobile">
                <Users className="h-4 w-4" />
                Users
            </MenuItem>
        </nav>
    );
}