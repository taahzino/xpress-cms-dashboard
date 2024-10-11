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
