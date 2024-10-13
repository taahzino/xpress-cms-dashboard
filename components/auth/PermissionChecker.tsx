import { checkPermission } from '@/lib/auth';

export default function PermissionChecker({ capabilities, children }: {
    capabilities: string[],
    children: React.ReactNode,
}) {
    if (!checkPermission(capabilities)) {
        return null;
    }

    return children;
}