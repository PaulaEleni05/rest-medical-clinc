import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
    const [form, setForm] = useState({
        appointment_date: "",
        doctor_id: "",
        patient_id: ""
    });
    
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    
    const navigate = useNavigate();
    const { token } = useAuth();

    // Fetch doctors and patients for dropdowns
    useEffect(() => {
        const fetchDoctors = async () => {
            const options = {
                method: "GET",
                url: "/doctors",
            };
            try {
                let response = await axios.request(options);
                console.log(response.data);
                setDoctors(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchPatients = async () => {
            const options = {
                method: "GET",
                url: "/patients",
            };
            try {
                let response = await axios.request(options);
                console.log(response.data);
                setPatients(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        
        fetchDoctors();
        fetchPatients();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createAppointment = async () => {
        const options = {
            method: "POST",
            url: `/appointments`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                appointment_date: form.appointment_date,
                doctor_id: Number(form.doctor_id),
                patient_id: Number(form.patient_id)
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/appointments', { state: { 
                type: 'success',
                message: `Appointment created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createAppointment();
    };

  return (
    <>
        <h1>Create a new Appointment</h1>
        <form onSubmit={handleSubmit}>
            <Input 
                className="mt-2"
                type="datetime-local" 
                name="appointment_date" 
                value={form.appointment_date} 
                onChange={handleChange}
                required
            />
            
            <select 
                className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                name="doctor_id" 
                value={form.doctor_id} 
                onChange={handleChange}
                required
            >
                <option value="">Choose doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                        {doctor.first_name} {doctor.last_name} - {doctor.specialisation}
                    </option>
                ))}
            </select>
            
            <select 
                className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                name="patient_id" 
                value={form.patient_id} 
                onChange={handleChange}
                required
            >
                <option value="">Choose patient</option>
                {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                    </option>
                ))}
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
