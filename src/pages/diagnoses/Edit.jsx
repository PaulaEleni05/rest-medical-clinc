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

    const formSchema = z.object({
        condition: z.string().min(2, "Condition must be at least 2 characters").max(255, "Condition must not exceed 255 characters"),
        diagnosis_date: z.string().min(1, "Diagnosis date is required"),
        patient_id: z.string().min(1, "Patient is required").transform((val) => parseInt(val, 10)),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            condition: "",
            diagnosis_date: "",
            patient_id: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            
            try {
                const [diagnosisRes, patientsRes] = await Promise.all([
                    axios.get(`/diagnoses/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/patients", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const diagnosis = diagnosisRes.data;
                setPatients(patientsRes.data);

                form.reset({
                    condition: diagnosis.condition || "",
                    diagnosis_date: diagnosis.diagnosis_date || "",
                    patient_id: String(diagnosis.patient_id) || "",
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load diagnosis");
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (data) => {
        const options = {
            method: "PATCH",
            url: `/diagnoses/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/diagnoses', { state: { 
                type: 'success',
                message: `Diagnosis updated successfully` 
            }});
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to update diagnosis. Please try again.");
        }
    };

  return (
    <>
        <Toaster />
        <h1>Edit Diagnosis</h1>
        <form id="diagnosis-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <Controller
                name="condition"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="condition">Condition</FieldLabel>
                        <Input
                            id="condition"
                            {...field}
                            placeholder="Enter condition"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="diagnosis_date"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="diagnosis_date">Diagnosis Date</FieldLabel>
                        <Input
                            id="diagnosis_date"
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

            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit"
                form="diagnosis-form"
            >Submit</Button>
        </form>
    </>
  );
}
