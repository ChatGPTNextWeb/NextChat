export interface TranscriptionConfig {
  baseUrl: string;
  model: string;
  apiKey?: string;
}

type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

interface RecordingDependencies {
  getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  createMediaRecorder: (stream: MediaStream) => MediaRecorder;
}

export interface ActiveAudioRecording {
  stop: () => Promise<Blob>;
}

const TRANSCRIPTION_PATH = "/audio/transcriptions";

export function buildTranscriptionUrl(baseUrl: string) {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  if (!normalized) {
    throw new Error("Transcription endpoint is required");
  }
  if (normalized.endsWith(TRANSCRIPTION_PATH)) {
    return normalized;
  }
  if (normalized.endsWith("/v1")) {
    return normalized + TRANSCRIPTION_PATH;
  }
  return normalized + "/v1" + TRANSCRIPTION_PATH;
}

export function mergeTranscriptionInput(
  current: string,
  transcription: string,
) {
  const text = transcription.trim();
  if (!text) return current;
  if (!current || /\s$/.test(current)) return current + text;
  return `${current} ${text}`;
}

export async function startAudioRecording(
  dependencies?: Partial<RecordingDependencies>,
): Promise<ActiveAudioRecording> {
  const getUserMedia =
    dependencies?.getUserMedia ??
    ((constraints) => navigator.mediaDevices.getUserMedia(constraints));
  const createMediaRecorder =
    dependencies?.createMediaRecorder ??
    ((stream) => new MediaRecorder(stream));

  const stream = await getUserMedia({ audio: true });
  const chunks: Blob[] = [];
  let released = false;
  let stopping = false;

  const releaseStream = () => {
    if (released) return;
    released = true;
    stream.getTracks().forEach((track) => track.stop());
  };

  let recorder: MediaRecorder;
  try {
    recorder = createMediaRecorder(stream);
  } catch (error) {
    releaseStream();
    throw error;
  }

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  try {
    recorder.start();
  } catch (error) {
    releaseStream();
    throw error;
  }

  return {
    stop() {
      if (stopping || recorder.state === "inactive") {
        return Promise.reject(new Error("Audio recording is not active"));
      }
      stopping = true;

      return new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          releaseStream();
          const type =
            recorder.mimeType || chunks.find((chunk) => chunk.type)?.type;
          resolve(new Blob(chunks, { type: type || "audio/webm" }));
        };
        recorder.onerror = () => {
          releaseStream();
          reject(new Error("Audio recording failed"));
        };
        try {
          recorder.stop();
        } catch (error) {
          releaseStream();
          reject(error);
        }
      });
    },
  };
}

function recordingExtension(mimeType: string) {
  const mediaType = mimeType.split(";", 1)[0].toLowerCase();
  switch (mediaType) {
    case "audio/mp4":
      return "m4a";
    case "audio/mpeg":
      return "mp3";
    case "audio/ogg":
      return "ogg";
    case "audio/wav":
    case "audio/x-wav":
      return "wav";
    case "audio/webm":
    default:
      return "webm";
  }
}

export async function transcribeAudio(
  audio: Blob,
  config: TranscriptionConfig,
  fetchFn: FetchFn = fetch,
) {
  const form = new FormData();
  form.append("file", audio, `recording.${recordingExtension(audio.type)}`);
  form.append("model", config.model);

  const apiKey = config.apiKey?.trim();
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetchFn(buildTranscriptionUrl(config.baseUrl), {
    method: "POST",
    headers,
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Transcription request failed (${response.status})`);
  }

  const payload = await response.json();
  if (typeof payload?.text !== "string") {
    throw new Error("Transcription response did not include text");
  }
  return payload.text.trim();
}
