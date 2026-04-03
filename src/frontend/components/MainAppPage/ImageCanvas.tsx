import denormalizeLandmarks from "@/utils/denormalizeLandmarks";
import generatePathFromPoints from "@/utils/generatePathFromPoints";
import landmarksToCoordinates from "@/utils/landmarksToCoordinates";
import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { useStore } from "store";
import { mergeRefs } from "react-merge-refs";
import { inRange } from "lodash";
import createLongLine from "@/utils/cobbAngle/createLongLine";
import createPerpendicularLine from "@/utils/cobbAngle/createPerpendicularLine";
import getSlope from "@/utils/cobbAngle/getSlope";

interface IImageCanvasProps {}

/* eslint-disable react/display-name */
const ImageCanvas: React.FC<IImageCanvasProps> = (props, ref) => {
  // From Global State
  const scoliotectAPIResponse = useStore((state) => state.scoliotectAPIResponse);
  const selectedFile = useStore((state) => state.selectedFile);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef() as MutableRefObject<CanvasRenderingContext2D>;

  // State for drawing
  const [points, setPoints] = useState<number[][]>();
  const [cobbLabelPositions, setCobbLabelPositions] = useState<
    Partial<Record<keyof AnglesType, { x: number; y: number }>>
  >({});
  const [draggingLabel, setDraggingLabel] = useState<keyof AnglesType | null>(
    null
  );
  const labelBoxesRef = useRef<
    Partial<
      Record<
        keyof AnglesType,
        {
          x: number;
          y: number;
          width: number;
          height: number;
          anchorX: number;
          anchorY: number;
          paddingHalf: number;
        }
      >
    >
  >({});
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const drawSettings = useStore((state) => state.drawSettings);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // null check
    if (!selectedFile) return; // null check

    canvas.width = selectedFile.width;
    canvas.height = selectedFile.height;

    const context = canvas.getContext("2d");
    if (!context) return;
    ctx.current = context;

    initialize();
  }, [scoliotectAPIResponse]);

  // Redraw everytime a setting changes
  useEffect(() => {
    labelBoxesRef.current = {};
    setCobbLabelPositions({});
  }, [selectedFile, scoliotectAPIResponse]);

  useEffect(() => {
    if (drawSettings && selectedFile && ctx && points && scoliotectAPIResponse) {
      drawImage();
      drawLandmarks({
        points: points,
        drawSettings: drawSettings,
      });
      drawDetections({
        detections: scoliotectAPIResponse.detections,
        drawSettings: drawSettings,
      });
      drawAngles({
        angles: scoliotectAPIResponse.angles,
        midpointLines: scoliotectAPIResponse.midpoint_lines,
        drawSettings: drawSettings,
      });
    }
  }, [drawSettings, cobbLabelPositions]);

  function getCanvasCoordinates(
    event: React.PointerEvent<HTMLCanvasElement>
  ): [number, number] {
    if (!canvasRef.current) return [0, 0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * canvasRef.current.width) / rect.width;
    const y = ((event.clientY - rect.top) * canvasRef.current.height) / rect.height;
    return [x, y];
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!selectedFile) return;
    const [x, y] = getCanvasCoordinates(event);

    const keys: (keyof AnglesType)[] = ["pt", "mt", "tl"];
    const target = keys.find((key) => {
      const box = labelBoxesRef.current[key];
      if (!box) return false;
      return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
    });

    if (!target) return;

    const targetBox = labelBoxesRef.current[target];
    if (!targetBox) return;
    dragOffsetRef.current = {
      dx: x - targetBox.anchorX,
      dy: y - targetBox.anchorY,
    };

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingLabel(target);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingLabel || !selectedFile) return;

    const box = labelBoxesRef.current[draggingLabel];
    if (!box) return;

    const [x, y] = getCanvasCoordinates(event);
    const rawAnchorX = x - dragOffsetRef.current.dx;
    const rawAnchorY = y - dragOffsetRef.current.dy;

    const minAnchorX = box.paddingHalf;
    const maxAnchorX = selectedFile.width - box.width + box.paddingHalf;
    const minAnchorY = box.height / 2;
    const maxAnchorY = selectedFile.height - box.height / 2;

    const clampedAnchorX = Math.min(maxAnchorX, Math.max(minAnchorX, rawAnchorX));
    const clampedAnchorY = Math.min(maxAnchorY, Math.max(minAnchorY, rawAnchorY));

    setCobbLabelPositions((prev) => ({
      ...prev,
      [draggingLabel]: { x: clampedAnchorX, y: clampedAnchorY },
    }));
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!draggingLabel) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDraggingLabel(null);
  }

  async function initialize() {
    drawImage();
    if (!selectedFile || !scoliotectAPIResponse) return;
    let points: number[][] = [];
    if (inRange(Math.max(...scoliotectAPIResponse.landmarks), 0, 1)) {
      // from /getprediction
      points = denormalizeLandmarks(
        scoliotectAPIResponse.landmarks,
        selectedFile.width,
        selectedFile.height
      ).filter(
        (point) =>
          Array.isArray(point) &&
          point.length === 2 &&
          Number.isFinite(point[0]) &&
          Number.isFinite(point[1])
      );
    } else {
      // from /v1/getprediction (flat [x,y,x,y,...])
      for (let i = 0; i + 1 < scoliotectAPIResponse.landmarks.length; i += 2) {
        const x = scoliotectAPIResponse.landmarks[i];
        const y = scoliotectAPIResponse.landmarks[i + 1];
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        points.push([
          x,
          y,
        ]);
      }
    }
    setPoints(points);
    drawLandmarks({
      points: points,
      drawSettings: drawSettings,
    });
    drawDetections({
      detections: scoliotectAPIResponse.detections,
      drawSettings: drawSettings,
    });
    drawAngles({
      angles: scoliotectAPIResponse.angles,
      midpointLines: scoliotectAPIResponse.midpoint_lines,
      drawSettings: drawSettings,
    });
  }

  function drawImage() {
    // Draw background
    if (!selectedFile || !canvasRef) return;
    ctx.current.fillRect(0, 0, selectedFile.width, selectedFile.height); // DO NOT RELY ON getBoundingBox for height and width because it's unreliable.

    // Draw Image
    ctx.current.drawImage(
      selectedFile.img,
      0,
      0,
      selectedFile.width,
      selectedFile.height
    );
  }

  function drawDetections({
    detections,
    drawSettings,
  }: {
    detections: DetectionType[];
    drawSettings: DrawSettingsType;
  }) {
    if (!drawSettings.showDetections) return;

    const parseColorToRgb = (color: string): [number, number, number] | null => {
      const ctx2d = document.createElement("canvas").getContext("2d");
      if (!ctx2d) return null;
      ctx2d.fillStyle = color;
      const normalized = ctx2d.fillStyle;

      // rgb(...) / rgba(...)
      const rgbMatch = normalized
        .replace(/\s+/g, "")
        .match(/^rgba?\((\d+),(\d+),(\d+)(?:,[\d.]+)?\)$/i);
      if (rgbMatch) {
        return [
          Number(rgbMatch[1]),
          Number(rgbMatch[2]),
          Number(rgbMatch[3]),
        ];
      }

      // #rgb / #rrggbb
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

      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    };

    const getDetectionLabelTextColor = (color: string) => {
      const rgb = parseColorToRgb(color);
      if (!rgb) return "white";

      // Perceived brightness; higher means lighter background.
      const brightness = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      return brightness >= 170 ? "black" : "white";
    };

    const detectionLabelTextColor = getDetectionLabelTextColor(
      drawSettings.detectionColor
    );

    // Drawing Bboxes
    detections.forEach((detection, i) => {
      let width = detection.xmax - detection.xmin;
      let height = detection.ymax - detection.ymin;

      // Drawing Rects
      ctx.current.lineWidth = 2 * drawSettings.detectionsScale;
      ctx.current.strokeStyle = drawSettings.detectionColor;
      ctx.current.strokeRect(detection.xmin, detection.ymin, width, height);
    });

    // Draw BBox Labels
    if (!drawSettings.showDetectionLabels) return;
    detections.forEach((detection, i) => {
      let fontSize = drawSettings.detectionTextSize;
      // Drawing Text
      ctx.current.fillStyle = detectionLabelTextColor;
      ctx.current.font = `${fontSize}px sans-serif`;
      ctx.current.textBaseline = "top";

      let padding = 10; // in px
      let text = `(${i + 1}) vert: ${(detection.confidence * 100).toFixed(0)}%`;
      let tm = ctx.current.measureText(text);

      ctx.current.fillStyle = `${drawSettings.detectionColor}cc`;
      ctx.current.fillRect(
        detection.xmin,
        detection.ymin,
        tm.width + padding,
        fontSize
      );

      ctx.current.fillStyle = detectionLabelTextColor;
      ctx.current.fillText(
        text,
        detection.xmin + padding * 0.5,
        detection.ymin
      );
    });
  }

  function drawLandmarks({
    points,
    drawSettings,
  }: {
    points: number[][];
    drawSettings: DrawSettingsType;
  }) {
    if (!drawSettings.showLandmarks) return;
    // DRAW POINTS
    ctx.current.lineWidth = 5;
    ctx.current.fillStyle = drawSettings.landmarkColor[0];
    let currVertPoint = 0;
    points.forEach((point, i) => {
      // Top Verts
      if ([0, 1].includes(currVertPoint))
        ctx.current.fillStyle = drawSettings.landmarkColor[0];
      if ([2, 3].includes(currVertPoint))
        ctx.current.fillStyle = drawSettings.landmarkColor[1];

      drawCircle(point[0], point[1], drawSettings.landmarkSize);

      currVertPoint = currVertPoint + 1;
      if (currVertPoint >= 4) currVertPoint = 0;
    });

    // DRAW PATHS
    const paths = generatePathFromPoints(
      points,
      drawSettings.landmarkDisplayType
    );
    // const paths = generatePathFromPoints(points, "no_lines");
    ctx.current.lineWidth = 8 * drawSettings.lineScale;
    switch (drawSettings.landmarkDisplayType) {
      case "all_lines":
        ctx.current.strokeStyle = drawSettings.lineColor;
        break;
      case "top_lines":
        ctx.current.strokeStyle = drawSettings.lineColor;
        break;
      case "bottom_lines":
        ctx.current.strokeStyle = drawSettings.lineColor;
        break;
      default:
        break;
    }

    paths.forEach((path) => {
      path.forEach((point, i) => {
        if (i === 0) {
          ctx.current.beginPath();
          ctx.current.moveTo(point[0], point[1]);
        } else ctx.current.lineTo(point[0], point[1]);

        if (i === path.length - 1) ctx.current.stroke();
      });
    });
  }

  function drawAngles({
    angles,
    midpointLines,
    drawSettings,
  }: {
    angles: AnglesType | null;
    midpointLines: ScoliotectAPIResponseType["midpoint_lines"];
    drawSettings: DrawSettingsType;
  }) {
    if (
      !drawSettings.showCobbAngle ||
      !scoliotectAPIResponse ||
      !selectedFile ||
      !midpointLines ||
      !angles
    )
      return;

    // Draw Midpoints
    ctx.current.strokeStyle = "white";
    ctx.current.lineWidth = 5 * drawSettings.cobbLineScale;
    midpointLines.forEach((mp, i) => {
      ctx.current.beginPath();
      ctx.current.moveTo(mp[0][0], mp[0][1]);
      ctx.current.lineTo(mp[1][0], mp[1][1]);
      ctx.current.stroke();
    });
    let top = 0;
    let bottom = 0;

    // Draw PT
    ctx.current.lineWidth = 5 * drawSettings.cobbLineScale;
    ctx.current.strokeStyle = "orange";
    ctx.current.fillStyle = "orange";

    top = angles.pt.idxs[0];
    bottom = angles.pt.idxs[1];
    drawCobbAngleLines(
      [midpointLines[top][0], midpointLines[top][1]],
      [midpointLines[bottom][0], midpointLines[bottom][1]],
      "pt",
      angles
    );

    // Draw TL
    ctx.current.lineWidth = 5 * drawSettings.cobbLineScale;
    ctx.current.strokeStyle = "lime";
    ctx.current.fillStyle = "lime";

    top = angles.tl.idxs[0];
    bottom = angles.tl.idxs[1];
    drawCobbAngleLines(
      [midpointLines[top][0], midpointLines[top][1]],
      [midpointLines[bottom][0], midpointLines[bottom][1]],
      "tl",
      angles
    );

    // Draw MT
    ctx.current.lineWidth = 5 * drawSettings.cobbLineScale;
    ctx.current.strokeStyle = "magenta";
    ctx.current.fillStyle = "magenta";

    top = angles.mt.idxs[0];
    bottom = angles.mt.idxs[1];
    drawCobbAngleLines(
      [midpointLines[top][0], midpointLines[top][1]],
      [midpointLines[bottom][0], midpointLines[bottom][1]],
      "mt",
      angles
    );
  }

  function drawCobbAngleLines(
    top: [[number, number], [number, number]],
    bottom: [[number, number], [number, number]],
    angleType: keyof AnglesType,
    angles: AnglesType
  ) {
    if (!selectedFile || !scoliotectAPIResponse) return;

    // 1. Draw Top
    let [topMinPoint, topMaxPoint] = createLongLine(
      top[0][0],
      top[1][0],
      top[0][1],
      top[1][1],
      selectedFile.width
    );
    drawLine(topMinPoint, topMaxPoint);

    // 2. Draw Bottom
    let [bottomMinPoint, bottomMaxPoint] = createLongLine(
      bottom[0][0],
      bottom[1][0],
      bottom[0][1],
      bottom[1][1],
      selectedFile.width
    );
    drawLine(bottomMinPoint, bottomMaxPoint);

    // 3. Draw Angle Label
    const textSize = drawSettings.cobbTextSize;
    const textPadding = Math.max(12, textSize * 0.45);
    const paddingHalf = textPadding * 0.5;

    ctx.current.font = `bold ${textSize}px manrope`;
    let text = `${angleType.toUpperCase()}=${angles[angleType].angle.toFixed(2)}°`;
    let measuredText = ctx.current.measureText(text);
    let prevFillStyle = ctx.current.fillStyle;
    ctx.current.textBaseline = "middle";
    const defaultAnchorX =
      selectedFile.width - measuredText.width - textPadding;
    const defaultAnchorY =
      topMaxPoint[1] + (bottomMaxPoint[1] - topMaxPoint[1]) / 2;
    const requestedAnchor = cobbLabelPositions[angleType] || {
      x: defaultAnchorX,
      y: defaultAnchorY,
    };

    const labelBoxWidth = measuredText.width + textPadding;
    const labelBoxHeight = textSize + textPadding;

    const minAnchorX = paddingHalf;
    const maxAnchorX = selectedFile.width - labelBoxWidth + paddingHalf;
    const minAnchorY = labelBoxHeight / 2;
    const maxAnchorY = selectedFile.height - labelBoxHeight / 2;
    const currentAnchor = {
      x: Math.min(maxAnchorX, Math.max(minAnchorX, requestedAnchor.x)),
      y: Math.min(maxAnchorY, Math.max(minAnchorY, requestedAnchor.y)),
    };

    const labelBoxX = currentAnchor.x - paddingHalf;
    const labelBoxY = currentAnchor.y - textSize * 0.5 - paddingHalf;

    labelBoxesRef.current[angleType] = {
      x: labelBoxX,
      y: labelBoxY,
      width: labelBoxWidth,
      height: labelBoxHeight,
      anchorX: currentAnchor.x,
      anchorY: currentAnchor.y,
      paddingHalf,
    };

    ctx.current.fillStyle = `rgba(0,0,0,0.7)`;
    ctx.current.fillRect(labelBoxX, labelBoxY, labelBoxWidth, labelBoxHeight);
    ctx.current.fillStyle = prevFillStyle;
    ctx.current.fillText(text, currentAnchor.x, currentAnchor.y);

    return;
    // 4. DRAW PERPENDICULAR
    // 4.1 DRAW PERPENDICULAR: TOP
    // - Swapper Based on Slope
    let startX = 550;
    let endX = 400;
    let temp = 0;
    let m = getSlope(top[0][0], top[1][0], top[0][1], top[1][1]);
    if (m < 0) {
      // Top line has a negative slope, SWAP
      let temp = startX;
      startX = endX;
      endX = temp;
    }

    let [startPoint, endPoint] = createPerpendicularLine(
      top[0][0],
      top[1][0],
      top[0][1],
      top[1][1],
      endX,
      startX
    );
    // drawCircle(endPoint[0], endPoint[1], 20);
    // drawCircle(startPoint[0], startPoint[1], 20);
    drawLine(startPoint, endPoint);

    // 4.2 DRAW PERPENDICULAR =: Bottom
    // - Swapper Based on Slope
    startX = 550;
    endX = 400;
    temp = 0;
    m = getSlope(bottom[0][0], bottom[1][0], bottom[0][1], bottom[1][1]);
    if (m > 0) {
      // Top line has a negative slope, SWAP
      let temp = startX;
      startX = endX;
      endX = temp;
    }

    [startPoint, endPoint] = createPerpendicularLine(
      bottom[0][0],
      bottom[1][0],
      bottom[0][1],
      bottom[1][1],
      endX,
      startX
    );
    // drawCircle(endPoint[0], endPoint[1], 20);
    // drawCircle(startPoint[0], startPoint[1], 20);
    drawLine(startPoint, endPoint);
  }

  function drawLine(p1: [number, number], p2: [number, number]) {
    ctx.current.beginPath();
    ctx.current.moveTo(p1[0], p1[1]);
    ctx.current.lineTo(p2[0], p2[1]);
    ctx.current.stroke();
  }

  function drawCircle(x: number, y: number, radius: number) {
    ctx.current.beginPath();
    ctx.current.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.current.fill();
  }

  function drawHouse() {
    // Set line width
    ctx.current.lineWidth = 10;
    ctx.current.strokeStyle = "green";
    ctx.current.fillStyle = "green";

    // Wall
    ctx.current.strokeRect(75, 140, 150, 110);

    // Door
    ctx.current.fillRect(130, 190, 40, 60);

    // Roof
    ctx.current.beginPath();
    ctx.current.moveTo(50, 140);
    ctx.current.lineTo(150, 60);
    ctx.current.lineTo(250, 140);
    ctx.current.closePath();
    ctx.current.stroke();
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
      id="image-canvas"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
};

export default ImageCanvas;

// Loading an image from a URL in Canvas
// https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

//   context.lineCap = "round";
//   context.lineWidth = 5;
//   context.strokeStyle = "darkGray";

// let url = "https://scoliotect-demo.vercel.app/example_images/3.jpg";
// let img = new Image();
// await new Promise((r) => (img.onload = r), (img.src = url));
// context.context.drawImage();
