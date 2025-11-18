import AdminDashboard from "./components/AdminDashboard";
import SuperAdminDashboard from "../superadmin/SuperAdminDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

type UserPayload = {
  id: string;
  role: "ADMIN" | "SUPERADMIN";
  tipePabrik: "PRODUSEN" | "DISTRIBUTOR" | "KONSUMEN";
};

async function getUserRole() {
  const tokenCookie = (await cookies()).get("session_token");

  if (!tokenCookie) {
    redirect("/login");
  }

  const token = tokenCookie.value;
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY kosong!");

  try {
    const payload = jwt.verify(token, SECRET_KEY) as UserPayload;
    return { role: payload.role, tipePabrik: payload.tipePabrik };
  } catch (err) {
    console.error("token tidak valid:", err);
    redirect("/login");
  }
}

export default async function DashboardPage() {
  const userData = await getUserRole();

  if (userData.role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (userData.role === "SUPERADMIN") {
    return <SuperAdminDashboard />;
  }

  return <div>Role tidak dikenali.</div>;
}
