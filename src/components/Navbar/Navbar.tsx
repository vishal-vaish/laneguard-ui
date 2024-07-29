"use client";

import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import {formatDateTime} from "@/lib/utils";
import CloseIcon from "@/components/Icon/CloseIcon";
import {ALERT_TOPIC, WEBSOCKET_URL} from "@/lib/queries";
import classNames from "classnames";
import {AlertType} from "@/lib/types";

export interface AlertMessage {
  type: string;
  content: string;
  timestamp: string;
}

const Navbar = () => {
  const [messages, setMessages] = useState<AlertMessage[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      client.subscribe(ALERT_TOPIC, (message) => {
        try {
          const newMessage: AlertMessage = JSON.parse(message.body);
          console.log('Received message:', newMessage);
          if (!newMessage) {
            console.warn('Received invalid or empty message from WebSocket');
            return;
          }
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  const latestMessage = messages[messages.length - 1];

  if (!latestMessage) return (<div className="h-[1rem]"></div>);

  const backgroundColor
    = latestMessage.type === AlertType.SUCCESS
    ? "bg-gradient-to-b from-green-500 to-green-700"
    : "bg-gradient-to-b from-red-400 to-red-700";

  return (
    <div
      className={classNames(backgroundColor,
        "min-w-full p-1 min-h-[3rem] h-[3rem] text-white relative flex items-center justify-center")}>
      <div className="absolute right-1 cursor-pointer p-2" onClick={clearMessages}><CloseIcon/></div>
      {latestMessage.content} ({formatDateTime(latestMessage?.timestamp)})
    </div>
  );
};

export default Navbar;
