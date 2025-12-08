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
  const [diagnosis, setDiagnosis] = useState({});
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      const options = {
        method: "GET",
        url: `/diagnoses/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDiagnosis(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDiagnosis();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{diagnosis.condition}</CardTitle>
        <CardDescription>
         Diagnosis Information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Condition:</strong> {diagnosis.condition}</p>
          <p><strong>Diagnosis Date:</strong> {formatDate(diagnosis.diagnosis_date)}</p>
          <p><strong>Patient:</strong> {diagnosis.patient?.first_name} {diagnosis.patient?.last_name}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
