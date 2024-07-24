"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {ScrollArea} from "@/components/ui/scroll-area";
import {formatDateTime, statusIndicator} from "@/lib/utils";
import {CameraDataType, GateDataType, VehicleAccessLog} from "@/lib/types";
import {useEffect, useState} from "react";
import {
  getAllAvailableEntryCameras,
  getAllAvailableExitCameras,
  getAllGates,
  getAllVehicleAccess
} from "@/lib/queries";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import CloseIcon from "@/components/Icon/CloseIcon";

const Log = () => {
  const [vehicleLogData, setVehicleLogData] = useState<VehicleAccessLog[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [entryCameraData, setEntryCameraData] = useState<CameraDataType[]>([]);
  const [exitCameraData, setExitCameraData] = useState<CameraDataType[]>([]);
  const [gateData, setGateData] = useState<GateDataType[]>([]);

  const getData = async () => {
    const entryCamera = await getAllAvailableEntryCameras(false);
    setEntryCameraData(entryCamera);
    const exitCamera = await getAllAvailableExitCameras(false);
    setExitCameraData(exitCamera);
    const gateData = await getAllGates();
    setGateData(gateData);
  }

  useEffect(() => {
    getData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllVehicleAccess(filterType, filterValue);
      setVehicleLogData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filterValue]);


  const renderFilterInput = () => {
    switch (filterType) {
      case "licensePlate":
        return (
          <Input
            placeholder="Enter License Plate"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
      case "entryCameraIpAddress":
        return (
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select Entry Camera"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {entryCameraData.map((data) => (
                  <SelectItem
                    value={data.ipAddress}
                    key={data.ipAddress}
                  >
                    {data.ipAddress}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "exitCameraIpAddress":
        return (
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select Exit Camera"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {exitCameraData.map((data) => (
                  <SelectItem
                    value={data.ipAddress}
                    key={data.ipAddress}
                  >
                    {data.ipAddress}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "entryGateName":
        return (
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gate"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {gateData.map((data) => (
                  <SelectItem
                    value={data.name}
                    key={data.id}
                  >
                    {data.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "status":
        return (
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const handleClearFilter = () => {
    setFilterType("");
    setFilterValue("");
    fetchData();
  }

  return (
    <div>
      <div className="flex gap-4 mx-4">
        <Select value={filterType} onValueChange={(value) => {
          setFilterType(value);
          setFilterValue("");
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Filter Type"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="licensePlate">License Plate</SelectItem>
            <SelectItem value="entryCameraIpAddress">Entry Camera</SelectItem>
            <SelectItem value="exitCameraIpAddress">Exit Camera</SelectItem>
            <SelectItem value="entryGateName">Gate</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {renderFilterInput()}
        {filterValue && (
          <Button variant="ghost" onClick={handleClearFilter}>
            <CloseIcon/>
          </Button>
        )}
      </div>

      <ScrollArea className="shadow-lg h-[calc(100vh-6rem)] relative m-4 bg-white rounded-lg mt-4">
        <Table>
          <TableHeader className="sticky top-0 bg-primary">
            <TableRow className="mx-0">
              <TableHead className="text-center text-white">License Plate</TableHead>
              <TableHead className="text-center text-white">Entry Time</TableHead>
              <TableHead className="text-center text-white">Exit Time</TableHead>
              <TableHead className="text-center text-white">Entry Gate</TableHead>
              <TableHead className="text-center text-white">Exit Gate</TableHead>
              <TableHead className="text-center text-white">Entry Camera</TableHead>
              <TableHead className="text-center text-white">Exit Camera</TableHead>
              <TableHead className="text-center text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleLogData.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="text-center">{data.licensePlate}</TableCell>
                <TableCell className="text-center">{formatDateTime(data.entryTime)}</TableCell>
                <TableCell className="text-center">{formatDateTime(data?.exitTime)}</TableCell>
                <TableCell className="text-center">{data.entryGate.name}</TableCell>
                <TableCell className="text-center">{data?.exitGate?.name}</TableCell>
                <TableCell className="text-center">{data.entryCamera.ipAddress}</TableCell>
                <TableCell className="text-center">{data?.exitCamera?.ipAddress}</TableCell>
                <TableCell className="flex justify-center text-center">
                  <div className={`h-4 w-4 rounded-full ${statusIndicator(data.status)}`}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
    ;
};

export default Log;
