"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {useEffect, useState} from "react";
import {getAllGates} from "@/lib/queries";
import {GateDataType} from "@/lib/types";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Edit3} from "lucide-react";
import CreateGateForm from "@/components/Form/CreateGateForm";
import {ScrollArea} from "@/components/ui/scroll-area";

const Gate = () => {
  const [gateData, setGateData] = useState<GateDataType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateDataType | undefined>(undefined);

  const fetchData = async () => {
    try {
      const data = await getAllGates();
      setGateData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialogForUpdate = (gate: GateDataType) => {
    setSelectedGate(gate);
    setDialogOpen(true);
  };

  const openDialogForCreate = () => {
    setSelectedGate(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    fetchData();
  };

  return (
    <div className="m-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="btn-primary" onClick={openDialogForCreate}>
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <CreateGateForm onDialogClose={handleDialogClose}/>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="shadow-lg h-[calc(100vh-8rem)] relative bg-white rounded-lg mt-4">
        <Table>
          <TableHeader className="sticky top-0 bg-primary">
            <TableRow className="mx-0">
              <TableHead className="text-center text-white">Id</TableHead>
              <TableHead className="text-center text-white">Name</TableHead>
              <TableHead className="text-center text-white">Entry Camera Id</TableHead>
              <TableHead className="text-center text-white">Exit Camera Id</TableHead>
              <TableHead className="text-center w-[100px] text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gateData.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="text-center">{data.id}</TableCell>
                <TableCell className="text-center">{data.name}</TableCell>
                <TableCell className="text-center">{data.entryCameraId}</TableCell>
                <TableCell className="text-center">{data.exitCameraId}</TableCell>
                <TableCell className="text-center w-[100px]">
                  <div className="flex">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => openDialogForUpdate(data)}>
                          <Edit3/>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <CreateGateForm data={selectedGate} onDialogClose={handleDialogClose}/>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default Gate;
