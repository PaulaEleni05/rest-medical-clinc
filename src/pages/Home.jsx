import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { token } = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    
    return (
        <>
            <h1>This is Home</h1>
            
            {/* DaisyUI Test Buttons
            <div className="space-y-4 p-4">
                <button className="btn">Default Button</button>
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-secondary">Secondary Button</button>
                <button className="btn btn-accent">Accent Button</button>
                <div className="alert alert-info">
                    <span>This is an info alert - DaisyUI is working!</span>
                </div>
            </div> */}
            
            {!token && (
                <div className="flex flex-col items-center gap-4">
                    {showRegister ? <RegisterForm /> : <LoginForm />}
                    
                    <p className="text-sm text-gray-600">
                        {showRegister ? "Already have an account? " : "Don't have an account? "}
                        <Button 
                            variant="link" 
                            onClick={() => setShowRegister(!showRegister)}
                            className="p-0 h-auto font-semibold"
                        >
                            {showRegister ? "Login here" : "Register here"}
                        </Button>
                    </p>
                </div>
            )}
            
        </>
    );
};