import { jest } from "@jest/globals";
import {
  buildTranscriptionUrl,
  mergeTranscriptionInput,
  startAudioRecording,
  transcribeAudio,
} from "../app/utils/transcription";

function mockResponse(payload: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

function mockFetch(response: Response) {
  return jest.fn<typeof fetch>().mockResolvedValue(response);
}

describe("buildTranscriptionUrl", () => {
  test.each([
    ["http://localhost:8000", "http://localhost:8000/v1/audio/transcriptions"],
    ["http://localhost:8000/", "http://localhost:8000/v1/audio/transcriptions"],
    [
      "http://localhost:8000/v1",
      "http://localhost:8000/v1/audio/transcriptions",
    ],
    [
      "http://localhost:8000/v1/",
      "http://localhost:8000/v1/audio/transcriptions",
    ],
    [
      "http://localhost:8000/v1/audio/transcriptions",
      "http://localhost:8000/v1/audio/transcriptions",
    ],
  ])("normalizes %s", (baseUrl, expected) => {
    expect(buildTranscriptionUrl(baseUrl)).toBe(expected);
  });

  test("rejects a blank base URL", () => {
    expect(() => buildTranscriptionUrl("  ")).toThrow(
      "Transcription endpoint is required",
    );
  });
});

describe("transcribeAudio", () => {
  test("posts an OpenAI-compatible multipart request", async () => {
    const fetchFn = mockFetch(mockResponse({ text: "  hello from audio  " }));
    const audio = new Blob(["audio"], { type: "audio/webm;codecs=opus" });

    await expect(
      transcribeAudio(
        audio,
        {
          baseUrl: "http://localhost:8000/v1/",
          model: "sensevoice",
          apiKey: "secret-token",
        },
        fetchFn,
      ),
    ).resolves.toBe("hello from audio");

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0];
    const request = init!;
    expect(url).toBe("http://localhost:8000/v1/audio/transcriptions");
    expect(request.method).toBe("POST");
    expect(request.headers).toEqual({
      Authorization: "Bearer secret-token",
    });

    const body = request.body as FormData;
    expect(body.get("model")).toBe("sensevoice");
    const file = body.get("file") as File;
    expect(file.name).toBe("recording.webm");
    expect(file.type).toBe("audio/webm;codecs=opus");
  });

  test("omits authorization when the API key is blank", async () => {
    const fetchFn = mockFetch(mockResponse({ text: "ok" }));

    await transcribeAudio(
      new Blob(["audio"], { type: "audio/wav" }),
      { baseUrl: "http://localhost:8000", model: "sensevoice", apiKey: " " },
      fetchFn,
    );

    expect(fetchFn.mock.calls[0][1]?.headers).toEqual({});
  });

  test("reports HTTP and malformed-response failures", async () => {
    const audio = new Blob(["audio"], { type: "audio/wav" });
    const config = { baseUrl: "http://localhost:8000", model: "sensevoice" };

    await expect(
      transcribeAudio(audio, config, mockFetch(mockResponse(null, 503))),
    ).rejects.toThrow("Transcription request failed (503)");
    await expect(
      transcribeAudio(audio, config, mockFetch(mockResponse({}))),
    ).rejects.toThrow("Transcription response did not include text");
  });
});

describe("mergeTranscriptionInput", () => {
  test("appends transcription without discarding an existing draft", () => {
    expect(mergeTranscriptionInput("", " hello ")).toBe("hello");
    expect(mergeTranscriptionInput("draft ", " hello ")).toBe("draft hello");
    expect(mergeTranscriptionInput("  draft", "hello")).toBe("  draft hello");
    expect(mergeTranscriptionInput("draft", "   ")).toBe("draft");
  });
});

describe("startAudioRecording", () => {
  test("releases the microphone if recorder creation fails", async () => {
    const stopTrack = jest.fn();
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream;
    const getUserMedia = jest
      .fn<(constraints: MediaStreamConstraints) => Promise<MediaStream>>()
      .mockResolvedValue(stream);
    const createMediaRecorder = jest
      .fn<(stream: MediaStream) => MediaRecorder>()
      .mockImplementation(() => {
        throw new Error("MediaRecorder is unavailable");
      });

    await expect(
      startAudioRecording({ getUserMedia, createMediaRecorder }),
    ).rejects.toThrow("MediaRecorder is unavailable");
    expect(stopTrack).toHaveBeenCalledTimes(1);
  });

  test("releases the microphone if stopping the recorder throws", async () => {
    const stopTrack = jest.fn();
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream;
    const recorder = {
      state: "inactive",
      mimeType: "audio/webm",
      ondataavailable: null,
      onstop: null,
      onerror: null,
      start(this: { state: string }) {
        this.state = "recording";
      },
      stop() {
        throw new Error("Unable to stop recording");
      },
    } as unknown as MediaRecorder;

    const recording = await startAudioRecording({
      getUserMedia: async () => stream,
      createMediaRecorder: () => recorder,
    });
    await expect(recording.stop()).rejects.toThrow("Unable to stop recording");
    expect(stopTrack).toHaveBeenCalledTimes(1);
  });

  test("collects recorder chunks and releases the microphone on stop", async () => {
    const stopTrack = jest.fn();
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream;
    const getUserMedia = jest
      .fn<(constraints: MediaStreamConstraints) => Promise<MediaStream>>()
      .mockResolvedValue(stream);

    const recorder = {
      mimeType: "audio/webm;codecs=opus",
      state: "inactive",
      ondataavailable: null as ((event: { data: Blob }) => void) | null,
      onstop: null as (() => void) | null,
      onerror: null as ((event: Event) => void) | null,
      start: jest.fn(function (this: { state: string }) {
        this.state = "recording";
      }),
      stop: jest.fn(function (this: {
        state: string;
        ondataavailable: ((event: { data: Blob }) => void) | null;
        onstop: (() => void) | null;
      }) {
        this.state = "inactive";
        this.ondataavailable?.({
          data: new Blob(["audio"], { type: "audio/webm;codecs=opus" }),
        });
        this.onstop?.();
      }),
    };
    const createMediaRecorder = jest
      .fn<(stream: MediaStream) => MediaRecorder>()
      .mockReturnValue(recorder as unknown as MediaRecorder);

    const recording = await startAudioRecording({
      getUserMedia,
      createMediaRecorder,
    });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(recorder.start).toHaveBeenCalledTimes(1);

    const audio = await recording.stop();
    expect(audio.size).toBe(5);
    expect(audio.type).toBe("audio/webm;codecs=opus");
    expect(stopTrack).toHaveBeenCalledTimes(1);
  });
});
