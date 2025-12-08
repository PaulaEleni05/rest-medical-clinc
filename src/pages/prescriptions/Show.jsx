import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Show() {
  const [prescription, setPrescription] = useState({});
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescription = async () => {
      const options = {
        method: "GET",
        url: `/prescriptions/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPrescription(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescription();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{prescription.medication}</CardTitle>
        <CardDescription>
          {prescription.dosage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Medication:</strong> {prescription.medication}</p>
          <p><strong>Dosage:</strong> {prescription.dosage}</p>
          <p><strong>Start Date:</strong> {formatDate(prescription.start_date)}</p>
          <p><strong>End Date:</strong> {formatDate(prescription.end_date)}</p>
          <p><strong>Patient:</strong> {prescription.patient?.first_name} {prescription.patient?.last_name}</p>
          <p><strong>Doctor:</strong> {prescription.doctor?.first_name} {prescription.doctor?.last_name}</p>
          <p><strong>Diagnosis:</strong> {prescription.diagnosis?.condition}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
