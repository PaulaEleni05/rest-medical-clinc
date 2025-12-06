import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

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

export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const formSchema = z.object({
        email: z.string().email("Invalid email address"),
        first_name: z
            .string()
            .min(2, "First name must be at least 2 characters.")
            .max(255, "First name must be at most 255 characters."),
        last_name: z
            .string()
            .min(2, "Last name must be at least 2 characters.")
            .max(255, "Last name must be at most 255 characters."),
        phone: z
            .string()
            .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
        specialisation: z
            .string()
            .min(1, "Please select a specialisation")
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            first_name: "",
            last_name: "",
            phone: "",
            specialisation: ""
        },
        mode: "onChange"
    });

    const handleSubmit = async (data) => {
        const options = {
            method: "POST",
            url: `/doctors`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data
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
            toast.error(err.response?.data?.message || "Failed to create doctor. Please try again.");
        }
    };

  return (
    <>
        <Toaster />
        <h1>Create a new Doctor</h1>
        <form id="doctor-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            {...field}
                            placeholder="doctor@example.com"
                            autoComplete="email"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                        <Input
                            id="first_name"
                            {...field}
                            placeholder="Michael"
                            autoComplete="given-name"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                        <Input
                            id="last_name"
                            {...field}
                            placeholder="O'Connor"
                            autoComplete="family-name"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <Input
                            id="phone"
                            {...field}
                            placeholder="0412345678"
                            autoComplete="tel"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="specialisation"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-2">
                        <FieldLabel htmlFor="specialisation">Specialisation</FieldLabel>
                        <select
                            id="specialisation"
                            {...field}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            aria-invalid={fieldState.invalid}
                        >
                            <option value="">Select Specialisation</option>
                            <option value="Podiatrist">Podiatrist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Psychiatrist">Psychiatrist</option>
                            <option value="General Practitioner">General Practitioner</option>
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
                form="doctor-form"
            >Submit</Button>
        </form>
    </>
  );
}