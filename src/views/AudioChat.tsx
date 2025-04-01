import { Button, Flex } from "antd";
import { useWebsocket } from "../hooks/useWebsocket";
import { useRecorder } from "../hooks/useRecorder";
import { useEffect, useState } from "react";

export function AudioChat() {
  const [canSpeaking, setCanSpeaking] = useState(false);
  const recorder = useRecorder({
    onRecord: (data) => {
      console.log("[LOG_INFO]", data);
      socket?.send(data);
    },
  });
  const { conn, socket, connect, disconnect } = useWebsocket("ws://127.0.0.1:8000/buddy/chat/demo", {
    onMessage: (data) => {
      if (typeof data === "string") {
        handleTextMessage(data);
      } else {
        handleStreamMessage();
      }
    },
  });

  const handleTextMessage = (message: string) => {
    try {
      const data = JSON.parse(message);
      switch (data.status) {
        case "ready": // 服务端准备好接受语音信息
          setCanSpeaking(true);
          break;
        case "startPush": // 服务端开始推送播放流
          setCanSpeaking(false);
          break;
        case "endPush": // 服务端结束推送播放流
          setCanSpeaking(false);
          break;
      }
    } catch (err) {}
  };

  const handleStreamMessage = () => {};

  const handleRecord = () => {
    if (recorder.running) {
      recorder.stop();
      socket?.send(JSON.stringify({ status: "end" }));
    } else {
      socket?.send(JSON.stringify({ status: "start" }));
      recorder.start();
    }
  };

  useEffect(() => {
    if (socket && conn) {
      socket.send(JSON.stringify({ status: "init", type: "webm" }));
    }
  }, [conn]);

  return (
    <div className="container">
      <Flex vertical gap={24}>
        <Button type="primary" size="large" onClick={conn ? disconnect : connect}>
          {conn ? "断开连接" : "连接服务器"}
        </Button>
        <canvas ref={recorder.canavsRef} width={600} height={200} style={{ backgroundColor: "#eee" }} />
        <Button disabled={!canSpeaking} size="large" color="cyan" variant="solid" onClick={handleRecord}>
          {recorder.running ? "停止说话" : "开始说话"}
        </Button>
      </Flex>
    </div>
  );
}
