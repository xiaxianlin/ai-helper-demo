import { useRef, useState } from "react";
import { Button, Flex, Input } from "antd";
import { useWebsocket } from "../hooks/useWebsocket";
import { SendOutlined } from "@ant-design/icons";
import { StreamPlayer } from "../core/Player";

export function TextTTSChat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player = useRef<StreamPlayer>();
  const [playing, setPlaying] = useState(false);
  const [value, setValue] = useState("你好");
  const { conn, socket, connect, disconnect } = useWebsocket("ws://127.0.0.1:8000/ai/llm_tts", {
    onMessage: (data) => {
      if (data === "done") {
        player.current?.stop();
      } else {
        player.current?.receive(data);
      }
    },
  });

  const send = () => {
    setPlaying(true);
    player.current = new StreamPlayer(canvasRef.current, {
      onEnd: () => {
        setValue("");
        setPlaying(false);
      },
    });
    socket?.send(value);
  };

  return (
    <div className="container">
      <Flex vertical gap={24}>
        <Button type="primary" size="large" onClick={conn ? disconnect : connect}>
          {conn ? "断开连接" : "连接服务器"}
        </Button>
        <canvas ref={canvasRef} width={600} height={200} style={{ backgroundColor: "#eee" }} />
        <Input
          size="large"
          value={value}
          placeholder="请输入"
          disabled={!conn || playing}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={send}
          suffix={<SendOutlined />}
        />
      </Flex>
    </div>
  );
}
