import { Button, Flex, Input } from "antd";
import { useState } from "react";
import { readFileBuffer } from "../utils/file";
import { useWebsocket } from "../hooks/useWebsocket";

export function ASRView() {
  const [result, setResult] = useState("");
  const { conn, socket, connect, disconnect } = useWebsocket("ws://127.0.0.1:8000/ai/asr", {
    onMessage: (data) => {
      console.log(data);
      setResult(data);
    },
  });

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    socket?.send("start");
    const buffer = await readFileBuffer(file);
    socket?.send(buffer);
    socket?.send("stop");
  };

  return (
    <div className="container">
      <Flex vertical gap={12}>
        <Button type="primary" size="large" onClick={conn ? disconnect : connect}>
          {conn ? "断开连接" : "连接服务器"}
        </Button>
        <Input
          type="file"
          disabled={!conn}
          onChange={({ target: { files } }) => {
            files && handleFileSelect(files[0]);
          }}
        />
        <div>
          <p>识别结果：</p>
          <Input.TextArea readOnly value={result} />
        </div>
      </Flex>
    </div>
  );
}
