"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore"; // Import the store

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();
  const { isAuthenticated, setAuthenticated } = useAuthStore();

  console.log("is auth:---", isAuthenticated);

  const validCredentials = {
    username: "John.ai@gmail.com",
    password: "Nplus123",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (
      formData.username === validCredentials.username &&
      formData.password === validCredentials.password
    ) {
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");

        // Navigate to home page if valid
        setAuthenticated(true);
        setFormData({ username: "", password: "" });
      }, 1000); // Add a small delay for better UX
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid username or password. Please try again..",
        });
        setAuthenticated(false);
      }, 1000);
    }
  };

  useEffect(() => {
    console.log("isauth:--", isAuthenticated);
    if (isAuthenticated) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-center justify-center w-screen h-screen  bg-[#131314] ">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className=" bg-[#131314]  text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-[#FFFFFF80]">
            Enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#231F20]">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="border-[#131314] focus:ring-[#131314] "
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#231F20]">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-[#131314] focus:ring-[#131314]"
                required
              />
            </div>
            <Button
              type="submit"
              className={`w-full bg-[#131314] hover:bg-[#6f6f6f] text-white transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
