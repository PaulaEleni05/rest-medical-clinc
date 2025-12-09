import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";

export default function DeleteBtn({ resource, id, onDeleteCallback }) {
    const [isDeleting, setIsDeleting] = useState(false);

    let token = localStorage.getItem('token');

    const deleteCascade = async (doctorId) => {
        try {
            // Fetch all appointments for this doctor
            const appointmentsResponse = await axios.get('/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const doctorAppointments = appointmentsResponse.data.filter(
                app => app.doctor_id === doctorId
            );

            // Fetch all prescriptions for this doctor
            const prescriptionsResponse = await axios.get('/prescriptions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const doctorPrescriptions = prescriptionsResponse.data.filter(
                pres => pres.doctor_id === doctorId
            );

            // Delete all related appointments
            for (const appointment of doctorAppointments) {
                await axios.delete(`/appointments/${appointment.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Delete all related prescriptions
            for (const prescription of doctorPrescriptions) {
                await axios.delete(`/prescriptions/${prescription.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            console.log(`Deleted ${doctorAppointments.length} appointments and ${doctorPrescriptions.length} prescriptions`);
            
            return true;
        } catch (err) {
            console.error('Error during cascade delete:', err);
            return false;
        }
    };

    const onDelete = async () => {
        try {
            if (resource === 'doctors') {
                const cascadeSuccess = await deleteCascade(id);
                if (!cascadeSuccess) {
                    console.error('Failed to delete related records');
                    return;
                }
            }

            const options = {
                method: "DELETE",
                url: `/${resource}/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            let response = await axios.request(options);
            console.log(response.data);
            
            if (onDeleteCallback) {
                onDeleteCallback(id);
            }
            
        } catch (err) {
            console.log(err);
        }
    };

  return (
    (!isDeleting) ?(
        <Button 
            className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
            variant="outline"
            size="icon"
            onClick={() => setIsDeleting(true)}
        ><Trash /></Button>
    ) : (
        <>
            <p>Are you sure?</p>
            <Button 
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="cursor-pointer text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
            >Yes</Button>
            <Button 
                onClick={() => setIsDeleting(false)}
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-500 border-slate-500 hover:text-slate-700 hover:border-slate-700"
            >No</Button>
        </>
    )
   
  );
}