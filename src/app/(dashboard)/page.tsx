"use client";

import {getActiveVehicleAccess, MONITOR_TOPIC, WEBSOCKET_URL} from "@/lib/queries";
import {useEffect, useState} from "react";
import {VehicleMonitorLog} from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {formatDateTime, statusIndicator} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Client} from "@stomp/stompjs";

const Dashboard = () => {
  const [vehicleLogData, setVehicleMonitorLog] = useState<VehicleMonitorLog[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe(MONITOR_TOPIC, (alert) => {
        try {
          const newMessage = JSON.parse(alert.body);
          console.log('Received message:', newMessage);
          setVehicleMonitorLog(newMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket Error:', frame.headers['message'], frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);


  const fetchData = async () => {
    try {
      const data = await getActiveVehicleAccess();
      setVehicleMonitorLog(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollArea className="shadow-lg h-[calc(100vh-5rem)] relative m-4 bg-white rounded-lg mt-4">
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
              <TableCell className="text-center">{data.entryGateName}</TableCell>
              <TableCell className="text-center">{data?.exitGateName}</TableCell>
              <TableCell className="text-center">{data.entryCameraIpAddress}</TableCell>
              <TableCell className="text-center">{data?.exitCameraIpAddress}</TableCell>
              <TableCell className="flex justify-center text-center">
                <div className={`h-4 w-4 rounded-full ${statusIndicator(data.status)}`}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default Dashboard;
