
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const saveUserToFirestore = async (user: any, fullName?: string) => {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
        uid: user.uid,
        fullName: fullName || user.displayName,
        email: user.email,
        role: "student", // Default role
        createdAt: serverTimestamp(),
    }, { merge: true });
  }

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      // 1. Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // 2. Update their profile with the full name
      await updateProfile(userCredential.user, { displayName: values.fullName });
      
      // 3. Save user data to Firestore
      await saveUserToFirestore(userCredential.user, values.fullName);
      
      // 4. Automatically sign the user in
      await signInWithEmailAndPassword(auth, values.email, values.password);

      toast({
        title: "Account Created!",
        description: "Welcome to EduSpark! Redirecting you to the dashboard...",
      });
      router.push("/dashboard");

    } catch (error: any) {
      let description = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please log in.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);

      toast({
        title: "Login Successful!",
        description: `Welcome, ${result.user.displayName}!`,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: "Could not log in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
           <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
       <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.32 1.84-3.6 0-6.5-2.95-6.5-6.5s2.9-6.5 6.5-6.5c1.95 0 3.35.79 4.3 1.7l2.5-2.5C18.16 3.01 15.66 2 12.48 2c-5.45 0-9.94 4.45-9.94 9.9s4.49 9.9 9.94 9.9c2.86 0 5.1-1 6.8-2.65a7.35 7.35 0 0 0 2.4-5.36c0-.5-.05-1-.14-1.48z"></path></svg>}
        Google
      </Button>
    </div>
  );
}
