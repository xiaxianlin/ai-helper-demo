import { useEffect, useRef, useState } from "react";
import { Recorder } from "../core/Recorder";

export function useRecorder(options?: { onRecord?: (data: Blob) => void }) {
  const recorderRef = useRef<Recorder>();
  const canavsRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);

  const start = async () => {
    await recorderRef.current?.start(options?.onRecord);
    setRunning(true);
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRunning(false);
  };

  useEffect(() => {
    recorderRef.current = new Recorder(canavsRef.current);
  }, []);

  return {
    canavsRef,
    running,
    stop,
    start,
  };
}
