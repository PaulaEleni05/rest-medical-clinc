import { useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [error, setError] = useState("");
  const { onLogin } = useAuth();

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/register", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password
      });

      console.log("Registration successful:", response.data);

      await onLogin(form.email, form.password);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitForm}>
          <div className="flex flex-col gap-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                required
                minLength={2}
                maxLength={255}
                onChange={handleForm}
                value={form.first_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                required
                minLength={2}
                maxLength={255}
                onChange={handleForm}
                value={form.last_name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="test@example.com"
                required
                onChange={handleForm}
                value={form.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={255}
                onChange={handleForm}
                value={form.password}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                minLength={8}
                maxLength={255}
                onChange={handleForm}
                value={form.password_confirmation}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant='outline' onClick={submitForm} type="submit" className="w-full">
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
