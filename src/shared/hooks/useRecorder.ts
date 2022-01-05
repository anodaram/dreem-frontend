import { useEffect, useState } from "react";

type ReturnRecorderType = {
  audioURL: string;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

const useRecorder: () => ReturnRecorderType = () => {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (!recorder) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    if (!recorder) return;
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
    };
    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return { audioURL, isRecording, startRecording, stopRecording };
};

declare global {
  interface Window {
    inputStream: any;
  }
}

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  window.inputStream = stream;
  return new MediaRecorder(stream);
}

export default useRecorder;
