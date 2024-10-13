import { cookies, headers } from "next/headers";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(process.env.API_URL + "/auth/people/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return {
      success: false,
      error: "Invalid credentials",
    };
  }

  const data = await response.json();

  return {
    success: true,
    user: data.data,
  };
}

export async function signOut() {
  const token = cookies().get("jwt")?.value;

  const response = await fetch(process.env.API_URL + "/auth/people/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: "Failed to logout",
    };
  }

  return {
    success: true,
  };
}

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
