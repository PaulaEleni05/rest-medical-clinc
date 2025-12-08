import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Index() {
  const [prescriptions, setPrescriptions] = useState([]);
  const { token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const options = {
        method: "GET",
        url: "/prescriptions",
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPrescriptions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescriptions();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
  };

  return (
    <>
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/prescriptions/create`}>Create New Prescription</Link>
      </Button>

      <Table>
        <TableCaption>A list of all prescriptions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>
                {prescription.patient?.first_name} {prescription.patient?.last_name}
              </TableCell>
              <TableCell>
                {prescription.doctor?.first_name} {prescription.doctor?.last_name}
              </TableCell>
              <TableCell>{formatDate(prescription.start_date)}</TableCell>
              <TableCell>{formatDate(prescription.end_date)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                  ><Eye /></Button>
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                  ><Pencil /></Button>
                  <DeleteBtn resource="prescriptions" id={prescription.id} onDeleteCallback={onDeleteCallback} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
