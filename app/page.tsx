import { redirect } from "next/navigation";

export default function Home() {
  // for now simply redirect to login
  redirect("/login");
}
