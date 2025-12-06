import React, { useEffect } from "react";
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
  
  const [doctors, setDoctors] = React.useState([]);
  const [patients, setPatients] = React.useState([]);

  const formSchema = z.object({
    appointment_date: z
      .string()
      .min(1, "Appointment date and time is required"),
    doctor_id: z
      .string()
      .min(1, "Please select a doctor")
      .transform(Number),
    patient_id: z
      .string()
      .min(1, "Please select a patient")
      .transform(Number)
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_date: "",
      doctor_id: "",
      patient_id: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let appointment = response.data;
        form.reset({
          appointment_date: appointment.appointment_date,
          doctor_id: String(appointment.doctor_id),
          patient_id: String(appointment.patient_id),
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load appointment data");
      }
    };

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
        toast.error("Failed to load doctors");
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
        toast.error("Failed to load patients");
      }
    };

    fetchAppointment();
    fetchDoctors();
    fetchPatients();
  }, [id, token]);

  const handleSubmit = async (data) => {
    const options = {
      method: "PATCH",
      url: `/appointments/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        appointment_date: data.appointment_date,
        doctor_id: data.doctor_id,
        patient_id: data.patient_id
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/appointments", { state: { 
        type: 'success',
        message: `Appointment updated successfully` 
      }});
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update appointment. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <h1>Update Appointment</h1>
      <form id="appointment-edit-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <Controller
          name="appointment_date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2">
              <FieldLabel htmlFor="appointment_date">Appointment Date & Time</FieldLabel>
              <Input
                id="appointment_date"
                type="datetime-local"
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
                <option value="">Choose doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.first_name} {doctor.last_name} - {doctor.specialisation}
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
                <option value="">Choose patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
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
          form="appointment-edit-form"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
