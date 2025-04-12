import { useMemo, useRef, useState } from "react";
import { message, notification } from "antd";
import { useMemoizedFn } from "ahooks";
import _ from "lodash";
import { useLogin } from "../../hooks/useLogin";
import { Recorder } from "../../bases/Recorder";
import { StreamPlayer } from "../../bases/StreamPlayer";

const device = "ai_dev_device";

export const useModel = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [recorder, setRecorder] = useState<Recorder>();

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [receiving, setRevceiving] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [result, setResult] = useState("");

  const player = useRef<StreamPlayer>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const { token = "", loading } = useLogin(device);

  const url = useMemo(() => {
    const query = new URLSearchParams();
    query.append("device", device);
    query.append("token", token || "");

    return `ws://127.0.0.1:8000/api/chat/connect?${query.toString()}`;
  }, [token]);

  const handleMessage = (data: any) => {
    if (_.isString(data)) {
      console.log("[LOG_INFO]", data);
      const res = JSON.parse(data);
      if (res.cmd === "ready") {
        setReady(true);
      }
      if (res.cmd === "start") {
        setRevceiving(true);
        player.current = new StreamPlayer(canvasRef.current);
        player.current.onend = () => setPlaying(false);
        setPlaying(true);
      }
      if (res.cmd === "end") {
        setRevceiving(false);
        setResult(res.message);
      }
      if (res.cmd === "error") {
        api.error({ message: "服务异常", description: res.message, placement: "topRight" });
      }
    } else {
      player.current?.receive(data);
    }
  };

  const sendMessage = (cmd: string) => {
    socket?.send(JSON.stringify({ cmd }));
  };

  const connect = () => {
    if (!url || !token) {
      return message.error("Token or url missing.");
    }
    console.log("[LOG_INFO]", url);
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      message.success("服务已连接");
      ws.send(JSON.stringify({ cmd: "init", type: "webm" }));
      setConnecting(true);
    };
    ws.onclose = () => {
      message.warning("服务已断开");
      setConnecting(false);
    };
    ws.onmessage = (e) => {
      console.log("[LOG_INFO]", "消息接收中");
      handleMessage(e.data);
    };
    setSocket(ws);
  };

  const startRecord = () => {
    const recorder = new Recorder(canvasRef.current);

    recorder.onstream = (e) => {
      console.log("onstream", e.data.size);
      socket?.send(e.data);
    };

    recorder.start();
    setRecording(true);
    setRecorder(recorder);
    sendMessage("start");
  };

  const stopRecord = () => {
    recorder?.stop();
    setRecording(false);
    setRecorder(undefined);
    sendMessage("end");
  };

  const toggleConnect = useMemoizedFn(() => {
    connecting ? socket?.close() : connect();
  });

  const toggleRecord = useMemoizedFn(() => {
    recording ? stopRecord() : startRecord();
  });

  return {
    contextHolder,
    refs: { canvasRef },
    state: { ready, playing, loading, connecting, recording, receiving, result },
    toggleConnect,
    toggleRecord,
  };
};
