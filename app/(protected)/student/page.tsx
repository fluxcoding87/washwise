import { getSession } from "@/actions/getCurrentUser";
import { StudentClient } from "../_components/student-client";
import { redirect } from "next/navigation";

export default async function StudentPage() {
  const session = await getSession();
  console.log(session?.user.role);

  const role = session?.user.role;
  if (role === "student") {
    return <StudentClient />;
  } else if (role === "hostelStaff") {
    redirect("/");
  } else if (role === "plantStaff") {
    redirect("/");
  }
  return null;
}
