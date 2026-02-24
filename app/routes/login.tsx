
import { Login } from "~/Login/login"

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your account" },
  ];
}

export default function Home() {
  
  return (<Login />); // Optionally, render a loading spinner or placeholder
}
