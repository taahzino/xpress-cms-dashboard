import { headers } from "next/headers";

export function checkPermission(
  capabilities: string[],
  defaultProfile?: object
) {
  let allowedCapabilities: string[] = [];

  if (capabilities.length > 0) {
    allowedCapabilities = ["manage-everything", ...capabilities];

    allowedCapabilities = allowedCapabilities.filter(
      (capability, index) => allowedCapabilities.indexOf(capability) === index
    );

    let profile;

    if (!defaultProfile) {
      let headerList = headers();
      profile = JSON.parse(headerList.get("x-profile") || "{}");
    } else {
      profile = defaultProfile;
    }

    if (profile?.role?.capabilities) {
      let hasPermission = allowedCapabilities.some((capability) =>
        profile.role.capabilities.includes(capability)
      );

      if (!hasPermission) {
        return false;
      }
    }
  }

  return true;
}
