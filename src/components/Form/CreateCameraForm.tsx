"use client";

import {Button} from "@/components/ui/button"
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useRef, useState} from "react";
import {createCamera, updateCamera} from "@/lib/queries";
import {CameraDataType} from "@/lib/types";
import Loader from '@/components/Loader';
import {notyf} from "@/lib/notyf";
import InputMask from 'inputmask';

type Props = {
  data?: CameraDataType;
  onDialogClose: () => void;
}
const CreateCameraForm = ({data, onDialogClose}: Props) => {
  const [ipAddress, setIpAddress] = useState(data?.ipAddress || "");
  const [macAddress, setMacAddress] = useState(data?.macAddress || "");
  const [type, setType] = useState(data?.type || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ipInputRef = useRef(null);
  const macInputRef = useRef(null);

  useEffect(() => {
    if (ipAddress && ipInputRef.current) {
      InputMask({
        alias: "ip",
        greedy: false,
      }).mask(ipInputRef.current);
    }
  }, []);

  useEffect(() => {
    if (macAddress && macInputRef.current) {
      InputMask({
        alias: "mac",
        greedy: false
      }).mask(macInputRef.current);
    }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    if (!ipAddress || !macAddress || !type) {
      setErrorMessage("All fields are required");
      return;
    }
    setIsLoading(true);
    const cameraData: CameraDataType = {
      id: data ? data.id : null,
      ipAddress,
      macAddress,
      type
    }

    try {
      if (data) {
        await updateCamera(cameraData);
        notyf.success("Camera updated successfully");
      } else {
        await createCamera(cameraData);
        notyf.success("Camera added successfully");
      }
      setIpAddress("");
      setMacAddress("");
      setType("");
      onDialogClose();
    } catch (error: any) {
      {
        if (error && error.response.status === 409) {
          setErrorMessage(error.response.data.message);
        } else {
          data
            ? notyf.error("Error while updating camera")
            : notyf.error("Error while creating camera")
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{data ? "Update Camera" : "Add Camera"}</DialogTitle>
      </DialogHeader>
      <form className="py-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="ipv4" className="text-right">
            IP Address
          </Label>
          <Input
            className="col-span-3"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            type="text"
            id="ipv4"
            name="ipv4"
            placeholder="xxx.xxx.xxx.xxx"
            ref={ipInputRef}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="macaddress" className="text-right">
            MAC Address
          </Label>
          <Input
            id="macaddress"
            className="col-span-3"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            placeholder="XX:XX:XX:XX:XX:XX"
            ref={macInputRef}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="username" className="text-right">
            Type
          </Label>
          <Select
            value={type}
            onValueChange={setType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ENTRY">Entry</SelectItem>
                <SelectItem value="EXIT">Exit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          {errorMessage && <div className="text-red-500 text-center px-1">{errorMessage}</div>}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="shadow-md"
            disabled={isLoading}
          >
            {isLoading ? <Loader/> : data ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default CreateCameraForm;
