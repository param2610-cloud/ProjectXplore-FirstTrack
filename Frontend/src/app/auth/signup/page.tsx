"use client"
import{ useEffect, useState } from "react";
import Avataruploader from "@/lib/control/avataruploader";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { domain } from "@/lib/domain";
import { useRouter } from "next/navigation";
interface ErrorMessage {
    error: boolean;
    title: string;
    description: string;
}

interface Message {
    message: boolean;
    title: string;
    description: string;
}

function Signup() {
    const router = useRouter();
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setfirstName] = useState("");
    const [lastname, setlastName] = useState("");
    const [Confirmpassword, setConfirmPassword] = useState("");
    const [selectedfile,setselecetedfile] = useState(null);
    const [error, setError] = useState<ErrorMessage>();
    const [message, setMessage] = useState<Message>();
    const [same, setSame] = useState<boolean | null>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setloading] = useState(false)

    useEffect(() => {
        const login = async (): Promise<string | null> => {
            setloading(true)
            if (email && password) {
                try {
                    const response = await axios.post(`${domain}/api/v1/users/login`, {
                        email,
                        password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials:true
                    }); 
                    const { user } = response.data.data;
                    setMessage({
                        message: true,
                        title: "Successfully logged in",
                        description: user.name,
                    });
                    router.push("/dashboard");
                    return user._id;
                } catch (error: any) {
                    if (error.response) {
                        setError({
                            error: true,
                            title: "Login Failed",
                            description:
                                error.response.data.message ||
                                "An unexpected error occurred",
                        });
                    } else {
                        setError({
                            error: true,
                            title: "Login Failed",
                            description: "An unexpected error occurred",
                        });
                    }
                }
            } else {
                setError({
                    error: true,
                    title: "Login Failed",
                    description:
                        "Please fill in the email and password sections",
                });
            }
            setloading(false);
            return null;
        };

        if (registerSuccess) {
            const loginUser = async () => {
                const userId_ = await login();
                console.log(userId_);
                if (userId_) {
                    setUserId(userId_);
                    setLoginSuccess(true);
                    
                }
            };

            loginUser();
        }
    }, [registerSuccess]);


    useEffect(() => {
        if (
            Confirmpassword === password &&
            Confirmpassword !== "" &&
            password !== ""
        ) {
            setSame(true);
        } else {
            setSame(false);
        }
    }, [Confirmpassword, password]);

    const { toast } = useToast();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setloading(true)
        if (
            email &&
            password &&
            firstname &&
            lastname &&
            Confirmpassword &&
            password === Confirmpassword &&
            selectedfile
        ) {
            try {
                const formdata = new FormData();
                formdata.append("fullName",  firstname + " "+ lastname);
                formdata.append("email", email);
                formdata.append("password", password);
                formdata.append("avatar", selectedfile, "Avatar.jpg");

                const response = await axios.post(`${domain}/api/v1/users/register`, formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const user = response.data.data;

                setMessage({
                    message: true,
                    title: "Successfully Registered.",
                    description: user.name,
                });
                setRegisterSuccess(true);
            } catch (error: any) {
                if (error.response) {
                    setError({
                        error: true,
                        title: "Registration Failed",
                        description:
                            error.response.data.message ||
                            "An unexpected error occurred",
                    });
                } else {
                    setError({
                        error: true,
                        title: "Registration Failed",
                        description: "An unexpected error occurred",
                    });
                }
            }
        } else {
            setError({
                error: true,
                title: "Registration Failed",
                description:
                    "Please fill Full Name, Email, password and confirm password",
            });
        }
        setloading(false)
    };
    useEffect(() => {
        if (error?.error == true) {
            toast({
                title: error.title,
                description: error.description,
            });
        }
    }, [error]);
    useEffect(() => {
        if (message?.message == true) {
            toast({
                title: message.title,
                description: message.description,
            });
        }
    }, [message]);

    return (
        <div className="w-screen min-h-screen max-h-full flex justify-center items-center">
            <Toaster/>
        <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
            <div className="">
                <Avataruploader setselecetedfile={setselecetedfile}/>
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required value={firstname} onChange={(e:any)=>setfirstName(e.target.value)}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required value={lastname} onChange={(e:any)=>setlastName
                (e.target.value)}/>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email} 
              onChange={(e:any)=>setemail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2"> 
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input id="confirmpassword" type="password" value={Confirmpassword} onChange={(e:any)=>setConfirmPassword(e.target.value)}/>
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit} disabled={loading?true:false}>
            Create an account
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
        </div>
    );
}

export default Signup;