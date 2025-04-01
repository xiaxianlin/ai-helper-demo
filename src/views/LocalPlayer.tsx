import { Button, Flex, Input } from "antd";
import { useRef, useState } from "react";
import { LocalPlayer } from "../core/Player";
import { PlayCircleOutlined } from "@ant-design/icons";
import { readFileBuffer } from "../utils/file";

export function LocalPlayerView() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [player, setPlayer] = useState<LocalPlayer>();

  const handleFileSelect = async (file: File) => {
    const buffer = await readFileBuffer(file);
    setPlayer(
      new LocalPlayer(buffer, ref.current, {
        onEnd: () => setRunning(false),
      })
    );
  };

  const start = () => {
    setRunning(true);
    player?.start();
  };

  return (
    <div className="container">
      <Flex vertical gap={24}>
        <Input
          type="file"
          onChange={({ target: { files } }) => {
            files && handleFileSelect(files[0]);
          }}
        />
        <canvas ref={ref} width={600} height={200} style={{ backgroundColor: "#eee" }} />
        <Button disabled={!player || running} size="large" type="primary" onClick={start} icon={<PlayCircleOutlined />}>
          开始
        </Button>
      </Flex>
    </div>
  );
}
