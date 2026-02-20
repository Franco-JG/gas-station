'use client';
import { LoginView } from "@/components";
import { useEffect } from "react";

export default function LoginPage() {

  useEffect(() => {
    console.log("LoginPage mounted")
  }, [])
  

  return (
    <div>
      <LoginView/>
    </div>
  );
}