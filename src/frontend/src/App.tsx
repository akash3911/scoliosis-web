import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const COLOR_PRESETS = ["#FFFFFF", "#000000", "#00FFFF"];
const DISPLAY_TYPES: Array<{ label: string; value: LandmarkDisplayType }> = [
  { label: "No lines", value: "no_lines" },
  { label: "Top lines", value: "top_lines" },
  { label: "Bottom lines", value: "bottom_lines" },
  { label: "All lines", value: "all_lines" },
];

const DEFAULT_DRAW_SETTINGS: DrawSettingsType = {
  showDetections: true,
  showDetectionLabels: true,
  detectionsScale: 1,
  detectionColor: "#00FFFF",
  detectionTextSize: 10,
  showLandmarks: false,
  landmarkDisplayType: "no_lines",
  landmarkSize: 7,
  landmarkColor: ["#FFFFFF", "#000000"],
  lineWidth: 2,
  lineScale: 0.5,
  lineColor: "#00FFFF",
  showCobbAngle: true,
  cobbLineScale: 1,
  cobbTextSize: 38,
};

type SelectedImageFile = File & {
  img: HTMLImageElement;
  src: string;
  width: number;
  height: number;
};

type LandmarkDisplayType = "no_lines" | "top_lines" | "bottom_lines" | "all_lines";

type DetectionType = {
  class: number;
  confidence: number;
  name: string;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
};

type AnglesType = {
  [K in "pt" | "mt" | "tl"]: {
    angle: number;
    idxs: [number, number];
  };
};

type ScoliotectAPIResponseType = {
  landmarks: number[];
  detections: DetectionType[];
  angles: AnglesType | null;
  midpoint_lines: [[number, number], [number, number]][] | null;
  curve_type: "C" | "S" | null;
  normalized_detections: DetectionType[];
  base64_image: string;
};

type DrawSettingsType = {
  showDetections: boolean;
  showDetectionLabels: boolean;
  detectionsScale: number;
  detectionColor: string;
  detectionTextSize: number;
  showLandmarks: boolean;
  landmarkDisplayType: LandmarkDisplayType;
  landmarkSize: number;
  landmarkColor: [string, string];
  lineWidth: number;
  lineScale: number;
  lineColor: string;
  showCobbAngle: boolean;
  cobbLineScale: number;
  cobbTextSize: number;
};

function App() {
  const [selectedFile, setSelectedFile] = useState<SelectedImageFile | undefined>();
  const [apiResponse, setApiResponse] = useState<ScoliotectAPIResponseType | undefined>();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [drawSettings, setDrawSettings] = useState<DrawSettingsType>(DEFAULT_DRAW_SETTINGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxCobb = useMemo(() => {
    if (!apiResponse?.angles) return null;
    return getMaxCobbAngle(apiResponse.angles);
  }, [apiResponse]);

  useEffect(() => {
    document.title = "Scoliotect | Automatic Cobb Angle Measurement";
  }, []);

  useEffect(() => {
    return () => {
      if (selectedFile?.src?.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFile.src);
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      setApiResponse(undefined);
      setFetchError(false);
      return;
    }

    let canceled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setFetchError(false);
        try {
          const response = await getPrediction(selectedFile);
          if (!canceled) {
            setApiResponse(response.data);
          }
        } catch (error) {
          if (!canceled) {
            setFetchError(true);
            setApiResponse(undefined);
          }
        } finally {
          if (!canceled) {
            setLoading(false);
          }
        }
      })();
    }, 350);

    return () => {
      canceled = true;
      window.clearTimeout(timer);
    };
  }, [selectedFile]);

  useEffect(() => {
    drawCanvas(canvasRef.current, selectedFile, apiResponse, drawSettings);
  }, [selectedFile, apiResponse, drawSettings]);

  async function handleFiles(files: FileList | File[]) {
    const file = files[0];
    if (!file) return;
    const nextFile = await createSelectedFile(file);
    setSelectedFile(nextFile);
  }

  async function handleExampleImage(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], url.split("/").pop() || "example-image.jpg", {
      type: blob.type,
    });
    const nextFile = await createSelectedFile(file);
    setSelectedFile(nextFile);
  }

  async function createSelectedFile(file: File) {
    const src = URL.createObjectURL(file);
    const img = await loadImage(src);
    return Object.assign(file, {
      img,
      src,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }) as SelectedImageFile;
  }

  function updateSetting<K extends keyof DrawSettingsType>(key: K, value: DrawSettingsType[K]) {
    setDrawSettings((prev) => ({ ...prev, [key]: value }));
  }

  function downloadCanvas(format: "png" | "jpeg") {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const date = new Date();
    const suffix = date
      .toLocaleString("en-us", { month: "long", day: "numeric" })
      .replaceAll(" ", "");
    const time = date
      .toLocaleTimeString("en-us", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      })
      .replaceAll(":", "");

    link.download = `ScoliotectResult_${suffix}_${time}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 1);
    link.click();
  }

  const selectedIndex = DISPLAY_TYPES.findIndex((item) => item.value === drawSettings.landmarkDisplayType);
  const isCSharp = maxCobb?.value !== undefined && maxCobb.value < 10;
  const severityClass = !maxCobb
    ? "status-dot"
    : maxCobb.value < 10
      ? "status-dot good"
      : maxCobb.value < 25
        ? "status-dot warn"
        : "status-dot bad";

  return (
    <div className="app-shell">
      <section className="hero">
        <div className="fluid-container">
          <div className="hero-grid">
            <div>
              <span className="hero-badge">Scoliotect</span>
              <h1 className="hero-title">
                Automatic Cobb Angle
                <span className="accent">Measurement</span>
              </h1>
              <p className="hero-copy">
                Upload a spine X-ray, run the detection pipeline, and inspect the vertebra landmarks and Cobb-angle measurements without leaving this page.
              </p>
            </div>
            <div className="hero-card">
              <img src="/architecture.png" alt="Scoliotect architecture diagram" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="fluid-container">
          <div className="workspace-grid">
            <div className="canvas-panel">
              <div className="canvas-panel-inner">
                <div
                  className={`canvas-stage ${dragActive ? "dropzone is-active" : ""}`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={async (event) => {
                    event.preventDefault();
                    setDragActive(false);
                    await handleFiles(event.dataTransfer.files);
                  }}
                >
                  {!selectedFile ? (
                    <div className="dropzone">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (event) => {
                          await handleFiles(event.target.files || []);
                          event.target.value = "";
                        }}
                      />
                      <p className="dropzone-title">Drop a spine X-ray here</p>
                      <p className="dropzone-text">
                        Drag and drop an image or pick one from disk. You can also try the sample images below.
                      </p>
                      <div className="action-row">
                        <button type="button" className="action-button" onClick={() => fileInputRef.current?.click()}>
                          Upload image
                        </button>
                      </div>
                      <div className="example-grid">
                        <ExampleButton src="/example_images/1.jpg" onClick={handleExampleImage} />
                        <ExampleButton src="/example_images/2.jpg" onClick={handleExampleImage} />
                        <ExampleButton src="/example_images/4.jpg" onClick={handleExampleImage} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <canvas ref={canvasRef} className="canvas-preview" />
                      <div style={{ marginTop: "0.9rem", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div className="small-text">{selectedFile.name}</div>
                        <div className="action-row">
                          <button type="button" className="action-button secondary" onClick={() => fileInputRef.current?.click()}>
                            Replace image
                          </button>
                          <button type="button" className="action-button secondary" onClick={() => downloadCanvas("png")}>
                            Export PNG
                          </button>
                          <button type="button" className="action-button secondary" onClick={() => downloadCanvas("jpeg")}>
                            Export JPG
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <aside className="sidebar">
              <div className="sidebar-card">
                <p className="sidebar-kicker">Analyzer</p>
                <h2 className="sidebar-heading">X-ray controls</h2>

                <div className="control-stack" style={{ marginTop: "1rem" }}>
                  <div className="control-card">
                    <div className="control-row">
                      <span className="control-label">Input image</span>
                      <span className="small-text" style={{ textAlign: "right", maxWidth: "12rem" }}>
                        {selectedFile?.name || "None selected"}
                      </span>
                    </div>
                  </div>

                  <ToggleRow label="Show detections" checked={drawSettings.showDetections} onChange={(value) => updateSetting("showDetections", value)} />
                  {drawSettings.showDetections && (
                    <div className="control-stack" style={{ paddingLeft: "0.2rem" }}>
                      <ToggleRow label="Detection labels" checked={drawSettings.showDetectionLabels} onChange={(value) => updateSetting("showDetectionLabels", value)} />
                      <RangeRow label="Detection scale" value={drawSettings.detectionsScale} min={1} max={4} step={1} onChange={(value) => updateSetting("detectionsScale", value)} />
                      <ColorRow label="Detection color" color={drawSettings.detectionColor} onChange={(color) => updateSetting("detectionColor", color)} />
                      <RangeRow label="Detection text" value={drawSettings.detectionTextSize} min={2} max={48} step={0.25} onChange={(value) => updateSetting("detectionTextSize", value)} />
                    </div>
                  )}

                  <ToggleRow label="Show keypoints" checked={drawSettings.showLandmarks} onChange={(value) => updateSetting("showLandmarks", value)} />
                  {drawSettings.showLandmarks && (
                    <div className="control-stack" style={{ paddingLeft: "0.2rem" }}>
                      <div className="control-card">
                        <div className="control-row" style={{ marginBottom: "0.65rem" }}>
                          <span className="control-label">Mode</span>
                          <span className="small-text">{DISPLAY_TYPES[selectedIndex]?.label || "No lines"}</span>
                        </div>
                        <div className="segmented">
                          {DISPLAY_TYPES.map((item, index) => (
                            <button
                              key={item.value}
                              type="button"
                              className={index === selectedIndex ? "active" : ""}
                              onClick={() => {
                                updateSetting("landmarkDisplayType", item.value);
                                setCurrentIndex(index);
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <ColorRow
                        label="Top"
                        color={drawSettings.landmarkColor[0]}
                        onChange={(color) =>
                          updateSetting("landmarkColor", [
                            color,
                            drawSettings.landmarkColor[1],
                          ])
                        }
                      />
                      <ColorRow
                        label="Bottom"
                        color={drawSettings.landmarkColor[1]}
                        onChange={(color) =>
                          updateSetting("landmarkColor", [
                            drawSettings.landmarkColor[0],
                            color,
                          ])
                        }
                      />
                      <ColorRow label="Join" color={drawSettings.lineColor} onChange={(color) => updateSetting("lineColor", color)} />
                      <RangeRow label="Radius" value={drawSettings.landmarkSize} min={0} max={20} step={1} onChange={(value) => updateSetting("landmarkSize", value)} />
                      <RangeRow label="Line scale" value={drawSettings.lineScale} min={0} max={3} step={0.05} onChange={(value) => updateSetting("lineScale", value)} />
                    </div>
                  )}

                  <ToggleRow label="Show Cobb angle" checked={drawSettings.showCobbAngle} onChange={(value) => updateSetting("showCobbAngle", value)} />
                  {drawSettings.showCobbAngle && (
                    <div className="control-stack" style={{ paddingLeft: "0.2rem" }}>
                      <RangeRow label="Angle line" value={drawSettings.cobbLineScale} min={0.5} max={4} step={0.1} onChange={(value) => updateSetting("cobbLineScale", value)} />
                      <RangeRow label="Angle text" value={drawSettings.cobbTextSize} min={10} max={80} step={1} onChange={(value) => updateSetting("cobbTextSize", value)} />
                    </div>
                  )}

                  <div className="control-card">
                    {loading && <StatusBlock title="Analyzing image" subtitle="The model is working on the uploaded X-ray." />}
                    {!loading && !selectedFile && <StatusBlock title="Choose an image" subtitle="Upload a spine X-ray or use a sample image." />}
                    {!loading && fetchError && selectedFile && (
                      <StatusBlock
                        title="Request failed"
                        subtitle="The backend did not return a prediction. Check the server and try again."
                        action={<button className="action-button secondary" type="button" onClick={() => void retryFetch(selectedFile, setLoading, setFetchError, setApiResponse)}>Try again</button>}
                      />
                    )}
                    {!loading && apiResponse?.angles && selectedFile && !fetchError && maxCobb && <ResultsPanel response={apiResponse} maxCobb={maxCobb} />}
                    {!loading && selectedFile && apiResponse && !apiResponse.angles && !fetchError && (
                      <StatusBlock title="No valid curve results" subtitle="The model returned a response, but no Cobb-angle data was available for this image." />
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

function ExampleButton({ src, onClick }: { src: string; onClick: (url: string) => Promise<void> }) {
  return (
    <button
      type="button"
      className="example-button"
      style={{ backgroundImage: `url(${src})` }}
      aria-label={`Try example image ${src}`}
      onClick={() => void onClick(src)}
    />
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="control-card">
      <div className="control-row">
        <span className="control-label">{label}</span>
        <label className="toggle" aria-label={label}>
          <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
          <span />
        </label>
      </div>
    </div>
  );
}

function RangeRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="control-card">
      <div className="slider-row" style={{ marginBottom: "0.5rem" }}>
        <span className="control-label">{label}</span>
        <span className="small-text">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function ColorRow({ label, color, onChange }: { label: string; color: string; onChange: (color: string) => void }) {
  return (
    <div className="control-card">
      <div className="color-row">
        <span className="control-label">{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-label={`${label} ${preset}`}
              className="status-pill"
              onClick={() => onChange(preset)}
              style={{ padding: "0.35rem 0.55rem" }}
            >
              <span className="status-dot" style={{ background: preset, border: "1px solid rgba(15,23,42,0.08)" }} />
            </button>
          ))}
          <input aria-label={`${label} custom color`} type="color" value={color} onChange={(event) => onChange(event.target.value)} />
        </div>
      </div>
    </div>
  );
}

function StatusBlock({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="results">
      <p className="results-title">{title}</p>
      <p className="small-text">{subtitle}</p>
      {action}
    </div>
  );
}

function ResultsPanel({ response, maxCobb }: { response: ScoliotectAPIResponseType; maxCobb: { max: keyof AnglesType; value: number } }) {
  const severity = maxCobb.value < 10 ? "Normal" : maxCobb.value < 25 ? "Mild" : maxCobb.value < 40 ? "Moderate" : "Severe";
  return (
    <div className="results">
      <p className="results-title">Results</p>
      <div className="status-pill">
        <span className={`status-dot ${severity === "Normal" ? "good" : severity === "Mild" ? "warn" : "bad"}`} />
        {response.curve_type ? `${response.curve_type}-curve` : "No curve type"} · {severity}
      </div>
      <div className="results-grid">
        <div className="results-line"><span>PT</span><strong>{response.angles?.pt.angle.toFixed(2)}°</strong></div>
        <div className="results-line"><span>MT</span><strong>{response.angles?.mt.angle.toFixed(2)}°</strong></div>
        <div className="results-line"><span>TL/L</span><strong>{response.angles?.tl.angle.toFixed(2)}°</strong></div>
        <div className="results-line"><span>Greatest bend</span><strong>{maxCobb.max.toUpperCase()} {maxCobb.value.toFixed(2)}°</strong></div>
      </div>
    </div>
  );
}

async function retryFetch(
  file: SelectedImageFile,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFetchError: React.Dispatch<React.SetStateAction<boolean>>,
  setApiResponse: React.Dispatch<React.SetStateAction<ScoliotectAPIResponseType | undefined>>
) {
  setLoading(true);
  setFetchError(false);
  try {
    const response = await getPrediction(file);
    setApiResponse(response.data);
  } catch (error) {
    setFetchError(true);
    setApiResponse(undefined);
  } finally {
    setLoading(false);
  }
}

async function getPrediction(file: File) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const formData = new FormData();
  formData.append("image", file);
  return axios({
    url: `${apiBaseUrl}/v1/getprediction`,
    method: "POST",
    headers: { authorization: "your token" },
    data: formData,
  });
}

function getMaxCobbAngle(angles: AnglesType) {
  const entries = Object.entries(angles) as Array<[keyof AnglesType, AnglesType[keyof AnglesType]]>;
  let maxKey: keyof AnglesType = "pt";
  let maxValue = angles.pt.angle;
  for (const [key, value] of entries) {
    if (value.angle > maxValue) {
      maxKey = key;
      maxValue = value.angle;
    }
  }
  return { max: maxKey, value: maxValue };
}

async function createSelectedFile(file: File) {
  const src = URL.createObjectURL(file);
  const img = await loadImage(src);
  return Object.assign(file, {
    img,
    src,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }) as SelectedImageFile;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function parseColorToRgb(color: string): [number, number, number] | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = color;
  const normalized = ctx.fillStyle;

  const rgbMatch = normalized.replace(/\s+/g, "").match(/^rgba?\((\d+),(\d+),(\d+)(?:,[\d.]+)?\)$/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hexMatch) return null;

  const hex = hexMatch[1];
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }

  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function getContrastTextColor(color: string) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return "white";
  const brightness = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  return brightness >= 170 ? "black" : "white";
}

function denormalizeLandmarks(landmarks: number[], width: number, height: number) {
  const points: number[][] = [];
  for (let i = 0; i + 1 < landmarks.length; i += 2) {
    const x = landmarks[i];
    const y = landmarks[i + 1];
    if (Number.isFinite(x) && Number.isFinite(y)) {
      points.push([x * width, y * height]);
    }
  }
  return points;
}

function normalizeLandmarks(landmarks: number[], width: number, height: number) {
  const points: number[][] = [];
  if (landmarks.length === 0) return points;

  const looksNormalized = Math.max(...landmarks) <= 1;
  if (looksNormalized) {
    return denormalizeLandmarks(landmarks, width, height);
  }

  for (let i = 0; i + 1 < landmarks.length; i += 2) {
    const x = landmarks[i];
    const y = landmarks[i + 1];
    if (Number.isFinite(x) && Number.isFinite(y)) {
      points.push([x, y]);
    }
  }
  return points;
}

function drawCanvas(
  canvas: HTMLCanvasElement | null,
  selectedFile: SelectedImageFile | undefined,
  response: ScoliotectAPIResponseType | undefined,
  drawSettings: DrawSettingsType
) {
  if (!canvas || !selectedFile) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = selectedFile.width;
  canvas.height = selectedFile.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(selectedFile.img, 0, 0, selectedFile.width, selectedFile.height);

  if (!response) return;

  if (drawSettings.showDetections) {
    drawDetections(ctx, response.detections, drawSettings);
  }

  if (drawSettings.showLandmarks) {
    const points = normalizeLandmarks(response.landmarks, selectedFile.width, selectedFile.height);
    drawLandmarks(ctx, points, drawSettings);
  }

  if (drawSettings.showCobbAngle && response.angles && response.midpoint_lines) {
    drawCobbAngles(ctx, response.angles, response.midpoint_lines, drawSettings);
  }
}

function drawDetections(ctx: CanvasRenderingContext2D, detections: DetectionType[], drawSettings: DrawSettingsType) {
  const labelColor = getContrastTextColor(drawSettings.detectionColor);
  detections.forEach((detection, index) => {
    const width = detection.xmax - detection.xmin;
    const height = detection.ymax - detection.ymin;
    ctx.lineWidth = 2 * drawSettings.detectionsScale;
    ctx.strokeStyle = drawSettings.detectionColor;
    ctx.strokeRect(detection.xmin, detection.ymin, width, height);

    if (!drawSettings.showDetectionLabels) return;
    const fontSize = drawSettings.detectionTextSize;
    const text = `(${index + 1}) vert: ${(detection.confidence * 100).toFixed(0)}%`;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textBaseline = "top";
    const metrics = ctx.measureText(text);
    const padding = 10;
    ctx.fillStyle = `${drawSettings.detectionColor}cc`;
    ctx.fillRect(detection.xmin, detection.ymin, metrics.width + padding, fontSize + 4);
    ctx.fillStyle = labelColor;
    ctx.fillText(text, detection.xmin + padding * 0.5, detection.ymin + 2);
  });
}

function drawLandmarks(ctx: CanvasRenderingContext2D, points: number[][], drawSettings: DrawSettingsType) {
  if (!points.length) return;

  ctx.fillStyle = drawSettings.landmarkColor[0];
  ctx.strokeStyle = drawSettings.lineColor;
  ctx.lineWidth = 5;

  for (let index = 0; index < points.length; index++) {
    const [x, y] = points[index];
    const isBottom = index % 4 === 2 || index % 4 === 3;
    ctx.fillStyle = isBottom ? drawSettings.landmarkColor[1] : drawSettings.landmarkColor[0];
    ctx.beginPath();
    ctx.arc(x, y, drawSettings.landmarkSize, 0, Math.PI * 2);
    ctx.fill();
  }

  const groupCount = Math.floor(points.length / 4);
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    const base = groupIndex * 4;
    const group = points.slice(base, base + 4);
    const drawSegment = (a: number[], b: number[]) => {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    };

    if (drawSettings.landmarkDisplayType === "top_lines" || drawSettings.landmarkDisplayType === "all_lines") {
      drawSegment(group[0], group[1]);
    }
    if (drawSettings.landmarkDisplayType === "bottom_lines" || drawSettings.landmarkDisplayType === "all_lines") {
      drawSegment(group[2], group[3]);
    }
    if (drawSettings.landmarkDisplayType === "all_lines" && group.length === 4) {
      drawSegment(group[1], group[2]);
    }
  }
}

function drawCobbAngles(
  ctx: CanvasRenderingContext2D,
  angles: AnglesType,
  midpointLines: [[number, number], [number, number]][],
  drawSettings: DrawSettingsType
) {
  const styleMap: Record<keyof AnglesType, string> = {
    pt: "orange",
    mt: "magenta",
    tl: "lime",
  };

  const drawLine = (a: [number, number], b: [number, number], color: string) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5 * drawSettings.cobbLineScale;
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  };

  (Object.keys(angles) as Array<keyof AnglesType>).forEach((angleKey) => {
    const midpointIndexA = angles[angleKey].idxs[0];
    const midpointIndexB = angles[angleKey].idxs[1];
    const lineA = midpointLines[midpointIndexA];
    const lineB = midpointLines[midpointIndexB];
    if (!lineA || !lineB) return;

    drawLine(lineA[0], lineA[1], styleMap[angleKey]);
    drawLine(lineB[0], lineB[1], styleMap[angleKey]);

    const labelX = Math.min(ctx.canvas.width - 20, Math.max(20, ctx.canvas.width - 220));
    const labelY = Math.min(ctx.canvas.height - 20, Math.max(30, lineA[1][1] + (lineB[1][1] - lineA[1][1]) / 2));
    const text = `${angleKey.toUpperCase()}=${angles[angleKey].angle.toFixed(2)}°`;
    ctx.font = `bold ${drawSettings.cobbTextSize}px sans-serif`;
    const metrics = ctx.measureText(text);
    const padding = 14;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(labelX - padding * 0.5, labelY - drawSettings.cobbTextSize * 0.5 - padding * 0.5, metrics.width + padding, drawSettings.cobbTextSize + padding);
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(text, labelX, labelY);
  });
}
