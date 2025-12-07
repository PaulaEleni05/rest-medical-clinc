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

export default function Index() {
  const [diagnoses, setDiagnoses] = useState([]);
  const { token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDiagnoses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDiagnoses();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Diagnosis deleted successfully");
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
  };

  return (
    <>
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/diagnoses/create`}>Create New Diagnosis</Link>
      </Button>

      <Table>
        <TableCaption>A list of all diagnoses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Condition</TableHead>
            <TableHead>Diagnosis Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow key={diagnosis.id}>
              <TableCell>{diagnosis.condition}</TableCell>
              <TableCell>{diagnosis.diagnosis_date}</TableCell>
              <TableCell>
                {diagnosis.patient?.first_name} {diagnosis.patient?.last_name}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                  ><Eye /></Button>
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                  ><Pencil /></Button>
                  <DeleteBtn resource="diagnoses" id={diagnosis.id} onDeleteCallback={onDeleteCallback} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
