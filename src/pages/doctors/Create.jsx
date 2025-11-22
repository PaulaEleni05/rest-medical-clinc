import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        specialisation: ""
    });
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createDoctor = async () => {

        const options = {
            method: "POST",
            url: `/doctors`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/doctors', { state: { 
                type: 'success',
                message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createDoctor();
    };

  return (
    <>
        <h1>Create a new Doctor</h1>
        <form onSubmit={handleSubmit}>
            <Input 
                type="email" 
                placeholder="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="First Name" 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="Last Name" 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="tel" 
                placeholder="Phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
            />
            <select 
                className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                name="specialisation" 
                value={form.specialisation} 
                onChange={handleChange}
            >
                <option value="">Select Specialisation</option>
                <option value="Podiatrist">Podiatrist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="General Practitioner">General Practitioner</option>
            </select>
            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit" 
            >Submit</Button>
        </form>
    </>
  );
}