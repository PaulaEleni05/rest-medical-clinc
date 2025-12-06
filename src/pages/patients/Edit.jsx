import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
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

export default function Edit() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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
    address: z
      .string()
      .min(5, "Address must be at least 5 characters.")
      .max(500, "Address must be at most 500 characters."),
    date_of_birth: z
      .string()
      .min(1, "Date of birth is required")
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      date_of_birth: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    const fetchPatient = async () => {
      const options = {
        method: "GET",
        url: `/patients/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let patient = response.data;
        form.reset({
          email: patient.email,
          first_name: patient.first_name,
          last_name: patient.last_name,
          phone: patient.phone,
          address: patient.address,
          date_of_birth: patient.date_of_birth,
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load patient data");
      }
    };

    fetchPatient();
  }, [id, token]);

  const handleSubmit = async (data) => {
    const options = {
      method: "PATCH",
      url: `/patients/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/patients", { state: { 
        type: 'success',
        message: `Patient "${response.data.first_name} ${response.data.last_name}" updated successfully` 
      }});
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update patient. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <h1>Update Patient</h1>
      <form id="patient-edit-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                {...field}
                placeholder="patient@example.com"
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
                placeholder="Eleni"
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
                placeholder="Murphy"
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
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2">
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                id="address"
                {...field}
                placeholder="123 Main St, City"
                autoComplete="street-address"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="date_of_birth"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2">
              <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
              <Input
                id="date_of_birth"
                type="date"
                {...field}
                autoComplete="bday"
                aria-invalid={fieldState.invalid}
              />
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
          form="patient-edit-form"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
