
import { Register } from "~/Register/register";

export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Home() {
  
  return <Register />;
}
