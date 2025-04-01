import { message } from "antd";
import { useState } from "react";

export function useWebsocket(url: string, options?: { onMessage?: (data: any) => void }) {
  const [conn, setConn] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();

  const connect = () => {
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      message.success("连接成功");
      setConn(true);
    };

    ws.onerror = () => {
      message.error("连接异常");
      setConn(false);
    };

    ws.onclose = () => {
      message.info("连接断开");
      setConn(false);
    };

    ws.onmessage = (e) => {
      options?.onMessage?.(e.data);
    };

    setSocket(ws);
  };

  const disconnect = () => {
    socket?.close();
  };

  return {
    conn,
    socket,
    connect,
    disconnect,
  };
}
