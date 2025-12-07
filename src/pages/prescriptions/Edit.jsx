import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate, useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function Edit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    const formSchema = z.object({
        medication: z.string().min(2, "Medication must be at least 2 characters").max(255, "Medication must not exceed 255 characters"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().min(1, "End date is required"),
        patient_id: z.string().min(1, "Patient is required").transform((val) => parseInt(val, 10)),
        doctor_id: z.string().min(1, "Doctor is required").transform((val) => parseInt(val, 10)),
        diagnosis_id: z.string().min(1, "Diagnosis is required").transform((val) => parseInt(val, 10)),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            medication: "",
            dosage: "",
            start_date: "",
            end_date: "",
            patient_id: "",
            doctor_id: "",
            diagnosis_id: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            
            try {
                const [prescriptionRes, patientsRes, doctorsRes, diagnosesRes] = await Promise.all([
                    axios.get(`/prescriptions/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/patients", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/doctors", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/diagnoses", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const prescription = prescriptionRes.data;
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
                setDiagnoses(diagnosesRes.data);

                form.reset({
                    medication: prescription.medication || "",
                    dosage: prescription.dosage || "",
                    start_date: prescription.start_date || "",
                    end_date: prescription.end_date || "",
                    patient_id: String(prescription.patient_id) || "",
                    doctor_id: String(prescription.doctor_id) || "",
                    diagnosis_id: String(prescription.diagnosis_id) || "",
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load prescription");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (data) => {
        const options = {
            method: "PATCH",
            url: `/prescriptions/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/prescriptions', { state: { 
                type: 'success',
                message: `Prescription updated successfully` 
            }});
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to update prescription. Please try again.");
        }
    };

  return (
    <>
        <Toaster />
        <h1>Edit Prescription</h1>
        <form id="prescription-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <Controller
                name="medication"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="medication">Medication</FieldLabel>
                        <Input
                            id="medication"
                            {...field}
                            placeholder="Enter medication"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="dosage"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="dosage">Dosage</FieldLabel>
                        <Input
                            id="dosage"
                            {...field}
                            placeholder="e.g., 500mg twice daily"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
                        <Input
                            id="start_date"
                            type="date"
                            {...field}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                        <Input
                            id="end_date"
                            type="date"
                            {...field}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="patient_id"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="patient_id">Patient</FieldLabel>
                        <select
                            id="patient_id"
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            aria-invalid={fieldState.invalid}
                        >
                            <option value="">Select a patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={String(patient.id)}>
                                    {patient.first_name} {patient.last_name}
                                </option>
                            ))}
                        </select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="doctor_id"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="doctor_id">Doctor</FieldLabel>
                        <select
                            id="doctor_id"
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            aria-invalid={fieldState.invalid}
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={String(doctor.id)}>
                                    {doctor.first_name} {doctor.last_name}
                                </option>
                            ))}
                        </select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="diagnosis_id"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="diagnosis_id">Diagnosis</FieldLabel>
                        <select
                            id="diagnosis_id"
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            aria-invalid={fieldState.invalid}
                        >
                            <option value="">Select a diagnosis</option>
                            {diagnoses.map((diagnosis) => (
                                <option key={diagnosis.id} value={String(diagnosis.id)}>
                                    {diagnosis.condition}
                                </option>
                            ))}
                        </select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit"
                form="prescription-form"
            >Submit</Button>
        </form>
    </>
  );
}
