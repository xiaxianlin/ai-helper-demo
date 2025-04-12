import { useRef, useState } from "react";
import { Button, Flex, Input } from "antd";
import { useWebsocket } from "../hooks/useWebsocket";
import { SendOutlined } from "@ant-design/icons";
import { StreamPlayer } from "../bases/StreamPlayer";

export function TextToSpeak() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player = useRef<StreamPlayer>();
  const [playing, setPlaying] = useState(false);
  const [value, setValue] = useState("这是一段测试语音，测试一下效果");
  const { conn, socket, connect, disconnect } = useWebsocket("ws://127.0.0.1:8000/ai/tts", {
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
    const streamPlayer = new StreamPlayer(canvasRef.current);
    streamPlayer.onend = () => setPlaying(false);
    player.current = streamPlayer;
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
