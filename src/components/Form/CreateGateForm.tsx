import {Button} from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useEffect, useState} from "react";
import {
  createGate,
  getAllAvailableEntryCameras,
  getAllAvailableExitCameras,
  updateGate,
} from "@/lib/queries";
import {CameraDataType, GateDataType} from "@/lib/types";
import Loader from "@/components/Loader";
import {notyf} from "@/lib/notyf";

type Props = {
  data?: GateDataType;
  onDialogClose: () => void;
};

const CreateGateForm = ({data, onDialogClose}: Props) => {
  const [name, setName] = useState(data?.name || "");
  const [entryCameraId, setEntryCameraId] = useState(data?.entryCameraId || "");
  const [exitCameraId, setExitCameraId] = useState(data?.exitCameraId || "");
  const [entryCameraData, setEntryCameraData] = useState<CameraDataType[]>([]);
  const [exitCameraData, setExitCameraData] = useState<CameraDataType[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntryCameraIp, setSelectedEntryCameraIp] = useState("");
  const [selectedExitCameraIp, setSelectedExitCameraIp] = useState("");

  useEffect(() => {
    const fetchEntryCameraData = async (isAvailable: boolean) => {
      try {
        const data = await getAllAvailableEntryCameras(isAvailable);
        setEntryCameraData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchExitCameraData = async (isAvailable: boolean) => {
      try {
        const data = await getAllAvailableExitCameras(isAvailable);
        setExitCameraData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (data) {
      fetchEntryCameraData(false);
      fetchExitCameraData(false);
    } else {
      fetchEntryCameraData(true);
      fetchExitCameraData(true);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const selectedEntryCamera = entryCameraData.find(
        (camera) => camera.id === data.entryCameraId
      );
      const selectedExitCamera = exitCameraData.find(
        (camera) => camera.id === data.exitCameraId
      );
      if (selectedEntryCamera) {
        setSelectedEntryCameraIp(selectedEntryCamera.ipAddress);
      }
      if (selectedExitCamera) {
        setSelectedExitCameraIp(selectedExitCamera.ipAddress);
      }
    }
  }, [data, entryCameraData, exitCameraData]);

  const handleEntryCameraChange = (id: string) => {
    setEntryCameraId(id);
    const selectedCamera = entryCameraData.find((camera) => camera.id === id);
    if (selectedCamera) {
      setSelectedEntryCameraIp(selectedCamera.ipAddress);
    }
  };

  const handleExitCameraChange = (id: string) => {
    setExitCameraId(id);
    const selectedCamera = exitCameraData.find((camera) => camera.id === id);
    if (selectedCamera) {
      setSelectedExitCameraIp(selectedCamera.ipAddress);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!name || !entryCameraId || !exitCameraId) {
      setErrorMessage("All fields are required");
      return;
    }
    setIsLoading(true);

    const gateData: GateDataType = {
      id: data ? data.id : null,
      name,
      entryCameraId,
      exitCameraId,
    };

    try {
      if (data) {
        await updateGate(gateData);
        notyf.success("Gate updated successfully");
      } else {
        await createGate(gateData);
        notyf.success("Gate added successfully");
      }
      setName("");
      setEntryCameraId("");
      setExitCameraId("");
      setSelectedEntryCameraIp("");
      setSelectedExitCameraIp("");
      onDialogClose();
    } catch (error) {
      {
        data
          ? notyf.error("Error while updating gate")
          : notyf.error("Error while creating gate");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{data ? "Update Gate" : "Add Gate"}</DialogTitle>
      </DialogHeader>
      <form className="py-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="entryCameraId" className="text-right">
            Entry Camera
          </Label>
          <Select
            value={entryCameraId}
            onValueChange={handleEntryCameraChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Entry Camera">
                {selectedEntryCameraIp}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {entryCameraData.map((data) => (
                  <SelectItem key={data.id} value={data.id as string}>
                    {data.ipAddress}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="exitCameraId" className="text-right">
            Exit Camera
          </Label>
          <Select
            value={exitCameraId}
            onValueChange={handleExitCameraChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Entry Camera">
                {selectedExitCameraIp}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {exitCameraData.map((data) => (
                  <SelectItem key={data.id} value={data.id as string}>
                    {data.ipAddress}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          {errorMessage && (
            <div className="text-red-500 text-center px-1">{errorMessage}</div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" className="shadow-md" disabled={isLoading}>
            {isLoading ? <Loader/> : data ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default CreateGateForm;
