"use client";

import CreateCameraForm from "@/components/Form/CreateCameraForm";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {useEffect, useState} from "react";
import {getAllCamera} from "@/lib/queries";
import {CameraDataType} from "@/lib/types";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Edit3} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

const Camera = () => {
  const [cameraData, setCameraData] = useState<CameraDataType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraDataType | undefined>(undefined);

  const fetchData = async () => {
    try {
      const data = await getAllCamera();
      setCameraData(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialogForUpdate = (camera: CameraDataType) => {
    setSelectedCamera(camera);
    setDialogOpen(true);
  };

  const openDialogForCreate = () => {
    setSelectedCamera(undefined);
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
            <CreateCameraForm onDialogClose={handleDialogClose}/>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="shadow-lg h-[calc(100vh-8rem)] relative bg-white rounded-lg mt-4">
        <Table>
          <TableHeader className="sticky top-0 bg-primary">
            <TableRow className="mx-0">
              <TableHead className="text-center text-white">Sr. No.</TableHead>
              <TableHead className="text-center text-white">Ip Address</TableHead>
              <TableHead className="text-center text-white">Mac Address</TableHead>
              <TableHead className="text-center text-white">Type</TableHead>
              <TableHead className="text-center w-[100px] text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameraData.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell className="text-center">
                  {String(index + 1).padStart(4, '0')}
                </TableCell>
                <TableCell className="text-center">{data.ipAddress}</TableCell>
                <TableCell className="text-center">{data.macAddress}</TableCell>
                <TableCell className="text-center">{data.type}</TableCell>
                <TableCell className="text-center w-[100px]">
                  <div className="flex justify-center">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => openDialogForUpdate(data)}>
                          <Edit3/>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <CreateCameraForm data={selectedCamera} onDialogClose={handleDialogClose}/>
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

export default Camera;
