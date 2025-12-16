import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconStethoscope, IconUsers, IconCalendar, IconMedicalCross, IconClock, IconShieldCheck } from "@tabler/icons-react";
import axios from "@/config/api";

export default function Home() {
    const { token } = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    


// Dashboard data
const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    diagnoses: 0
});
 

// Landing page stats
const landingStats = [
    { value: "500+", label: "Patients" },
    { value: "50+", label: "Doctors" },
    { value: "1000+", label: "Appointments" },
    { value: "99%", label: "Satisfaction" }
];



// Features for landing page
const features = [
    {
        icon: IconStethoscope,
        title: "Expert Doctors",
        description: "Experienced medical professionals dedicated to your health"
    },
    {
        icon: IconCalendar,
        title: "Easy Appointments",
        description: "Schedule and manage your appointments with ease"
    },
    {
        icon: IconMedicalCross,
        title: "Medical Records",
        description: "Secure digital access to your complete medical history"
    },
    {
        icon: IconClock,
        title: "24/7 Support",
        description: "Round-the-clock assistance for your healthcare needs"
    }
];
 
// Fetch dashboard data when logged in
useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
        try {
            const [doctorsRes, patientsRes, appointmentsRes, diagnosesRes] = await Promise.all([
                axios.get("/doctors", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("/patients", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("/appointments", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("/diagnoses", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setStats({
                doctors: doctorsRes.data.length,
                patients: patientsRes.data.length,
                appointments: appointmentsRes.data.length,
                diagnoses: diagnosesRes.data.length
            });
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        }
    };

    fetchDashboardData();
}, [token]);
   

// If user is logged in, show dashboard
if (token) {
    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your medical clinic</p>
        </div>

{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <IconStethoscope className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{stats.doctors}</div>
            <p className="text-xs text-gray-500 mt-1">Medical professionals</p>
        </CardContent>
    </Card>

    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <IconUsers className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
            <p className="text-xs text-gray-500 mt-1">Registered patients</p>
        </CardContent>
    </Card>

    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{stats.appointments}</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled appointments</p>
        </CardContent>
    </Card>

    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diagnoses</CardTitle>
            <IconMedicalCross className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{stats.diagnoses}</div>
            <p className="text-xs text-gray-500 mt-1">Medical diagnoses</p>
        </CardContent>
    </Card>
    </div>
</div>
);
}

// If not logged in, show landing page
return (
    <div className="min-h-screen">
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
                <h1 className="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
                <p className="text-xl mb-8 text-blue-50">
                Experience modern healthcare with our comprehensive medical clinic management system.
                Book appointments, access medical records, and connect with expert doctors all in one place.</p>
                <div className="flex gap-4">
                    <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => setShowRegister(true)}>
                    Get Started
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                    Learn More
                    </Button>
                </div>
            </div>
        </div>
    </section>


{/* Stats Section */}
<section className="py-12 bg-white border-b">
    <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {landingStats.map((stat, index) => (
                <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                </div>
            ))}
        </div>
    </div>
</section>
 
{/* Features Section */}
<section className="py-16 px-4 bg-gray-50">
<div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">We provide comprehensive healthcare services with cutting-edge technology and compassionate care</p>
</div>
        
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-none">
                <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="text-blue-600" size={24} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-base">
                        {feature.description}
                    </CardDescription>
                </CardContent>
            </Card>
            ))}
        </div>
    </div>
</section>




{/* Login/Register Section */}
<section className="py-16 px-4 bg-white">
    <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {showRegister ? "Create Your Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-600">
            {showRegister
            ? "Join us to access all features"
            : "Sign in to manage your healthcare"}
        </p>
</div>
        
<Card className="shadow-xl border-none">
        <CardContent className="pt-6">
            {showRegister ? <RegisterForm /> : <LoginForm />}
        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                {showRegister ? "Already have an account? " : "Don't have an account? "}
                <Button
                    variant="link"
                    onClick={() => setShowRegister(!showRegister)}
                    className="p-0 h-auto font-semibold text-blue-600">
                    {showRegister ? "Login here" : "Register here"}
                </Button>
            </p>
        </div>
        </CardContent>
    </Card>
    </div>
</section>



{/* CTA Section */}
<section className="bg-blue-600 text-white py-16 px-4">
    <div className="max-w-4xl mx-auto text-center">
        <IconShieldCheck className="mx-auto mb-6" size={48} />
        <h2 className="text-3xl font-bold mb-4">
        Your Health Information is Safe With Us</h2>
        <p className="text-xl text-blue-50 mb-8">We use industry-leading security measures to protect your medical data</p>
        <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => setShowRegister(true)}>
        Get Started Today
        </Button>
    </div>
</section>
</div>
);
};