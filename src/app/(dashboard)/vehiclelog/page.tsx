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
import {formatDate, formatTime, getVehicleTypeBadgeStyle, statusIndicator} from "@/lib/utils";
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
import {ArrowRight, Calendar, Camera, Car, Clock} from "lucide-react";

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
    <div className="mt-2">
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

      <ScrollArea className="shadow-lg h-[calc(100vh-8rem)] relative m-4 bg-white rounded-lg mt-4">
        <Table>
          <TableHeader className="sticky top-0 bg-primary">
            <TableRow className="mx-0">
              <TableHead className="text-center text-white">License Plate</TableHead>
              <TableHead className="text-center text-white">Entry</TableHead>
              <TableHead className="text-center text-white">Exit</TableHead>
              <TableHead className="text-center text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleLogData.map((data) => {
              const isParked = !data.exitTime && !data.exitDetectionImagePath && !data.exitLicensePlateImagePath;
              const badgeStyle = getVehicleTypeBadgeStyle(data.vehicleType);

              return (
              <TableRow key={data.id}>
                <TableCell className="text-center">
                  {data.licensePlate}
                  <div className="mt-1">
                    <span
                      className={`
                      inline-flex items-center px-2 py-1 text-xs rounded-full border 
                      ${badgeStyle.backgroundColor} 
                      ${badgeStyle.textColor} 
                      ${badgeStyle.borderColor}
                      `}
                    >
                      <Car className="h-3 w-3 mr-1"/>
                      {badgeStyle.label}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-0 flex gap-5 justify-center">
                  <div className="flex flex-col text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-500"/>
                      {formatDate(data.entryTime)}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 text-gray-500"/>
                      {formatTime(data.entryTime)}
                    </div>
                    <div className="flex items-center mt-1">
                      <ArrowRight className="h-3 w-3 mr-1 text-gray-500"/>
                      {data.entryGate.name}
                    </div>
                    <div className="flex items-center mt-1">
                      <Camera className="h-3 w-3 mr-1 text-gray-500"/>
                      {data.entryCamera.ipAddress}
                    </div>
                  </div>
                  <div>
                    <img
                      src={data.entryDetectionImagePath}
                      alt="Entry Vehicle"
                      className="rounded border mb-1"
                      width="80"
                      height="60"
                    />
                    <div className="text-xs text-center text-gray-500">Vehicle</div>
                  </div>
                  <div>
                    <img
                      src={data.entryLicensePlateImagePath}
                      alt="Entry Plate"
                      className="rounded border mb-1"
                      width="80"
                      height="60"
                    />
                    <div className="text-xs text-center text-gray-500">Number Plate</div>
                  </div>
                </TableCell>
                <TableCell >
                  <div className="flex gap-5 px-0 justify-center">
                    {!isParked ? (
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500"/>
                          {formatDate(data.exitTime)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1 text-gray-500"/>
                          {formatTime(data.exitTime)}
                        </div>
                        <div className="flex items-center mt-1">
                          <ArrowRight className="h-3 w-3 mr-1 text-gray-500"/>
                          {data?.exitGate?.name}
                        </div>
                        <div className="flex items-center mt-1">
                          <Camera className="h-3 w-3 mr-1 text-gray-500"/>
                          {data?.exitCamera?.ipAddress}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Car className="h-5 w-5 text-blue-500 mb-1"/>
                        <span className="text-blue-500 font-medium">Currently Parked</span>
                      </div>
                    )}
                    {!isParked ? (
                      <div>
                        <img
                          src={data.exitDetectionImagePath}
                          alt="Exit Vehicle"
                          className="rounded border mb-1"
                          width="80"
                          height="60"
                        />
                        <div className="text-xs text-center text-gray-500">Vehicle</div>
                      </div>
                    ) : (
                      <div className="w-20 h-16 border rounded flex items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-400">Not Available</span>
                      </div>
                    )}
                    {!isParked ? (
                      <div>
                        <img
                          src={data.exitLicensePlateImagePath}
                          alt="Exit Plate"
                          className="rounded border mb-1"
                          width="80"
                          height="60"
                        />
                        <div className="text-xs text-center text-gray-500">Number Plate</div>
                      </div>
                    ) : (
                      <div className="w-20 h-16 border rounded flex items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-400">Not Available</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="px-2 py-2 text-center">
                    <span
                      className={`
                        inline-flex items-center justify-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs
                        ${statusIndicator(data.status).text},
                        ${statusIndicator(data.status).backgroundColor}`
                      }>
                        {data.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                      </span>
                  </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default Log;
