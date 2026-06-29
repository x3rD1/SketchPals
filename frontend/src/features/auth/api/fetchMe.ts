export const fetchMe = async () => {
  const res = await fetch("http://localhost:3000/auth/me", {
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
};
