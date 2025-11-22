import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
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
            
            {!token && <LoginForm />}
            
        </>
    );
};