import argparse
import json
from pathlib import Path

import cv2 as cv

from scoliotect.yolov8_detector import predict_image_to_api_format


def _iter_images(images: list[str]) -> list[Path]:
    files: list[Path] = []
    for item in images:
        path = Path(item)
        if path.is_file():
            files.append(path)
            continue

        if path.is_dir():
            for ext in ("*.jpg", "*.jpeg", "*.png", "*.bmp", "*.webp"):
                files.extend(sorted(path.glob(ext)))
            continue

        # Allow glob patterns like "samples/*.jpg"
        files.extend(sorted(Path().glob(item)))

    # Deduplicate while preserving order
    seen = set()
    deduped = []
    for file in files:
        key = str(file.resolve())
        if key not in seen:
            seen.add(key)
            deduped.append(file)
    return deduped


def _draw_result(image, result):
    out = image.copy()
    for det in result.get("detections", []):
        x1, y1, x2, y2 = det["xmin"], det["ymin"], det["xmax"], det["ymax"]
        cv.rectangle(out, (x1, y1), (x2, y2), (0, 255, 0), 2)
        label = f"{det['name']} {det['confidence']:.2f}"
        cv.putText(out, label, (x1, max(20, y1 - 8)), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv.LINE_AA)

    landmarks = result.get("landmarks", [])
    for i in range(0, len(landmarks), 2):
        x = int(round(landmarks[i]))
        y = int(round(landmarks[i + 1]))
        cv.circle(out, (x, y), 2, (0, 0, 255), -1)

    return out


def main():
    parser = argparse.ArgumentParser(description="Test YOLOv8 scoliosis model on images.")
    parser.add_argument(
        "images",
        nargs="+",
        help="Image file(s), directory path(s), or glob pattern(s). Example: data/*.jpg",
    )
    parser.add_argument("--save-dir", default="yolo_test_outputs", help="Directory to save annotated outputs.")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold for YOLOv8.")
    parser.add_argument("--iou", type=float, default=0.5, help="IoU threshold for YOLOv8 NMS.")
    args = parser.parse_args()

    image_files = _iter_images(args.images)
    if not image_files:
        raise SystemExit("No images found. Provide valid file, directory, or glob path.")

    save_dir = Path(args.save_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    for image_path in image_files:
        image = cv.imread(str(image_path))
        if image is None:
            print(f"[SKIP] Could not read image: {image_path}")
            continue

        result = predict_image_to_api_format(image_bgr=image, conf=args.conf, iou=args.iou)

        angles = result.get("angles")
        print("=" * 80)
        print(f"Image: {image_path}")
        print(f"Detections: {len(result['detections'])}")
        print(f"Curve Type: {result.get('curve_type')}")
        print("Angles:")
        print(json.dumps(angles, indent=2))

        output_image = _draw_result(image, result)
        out_path = save_dir / f"{image_path.stem}_pred{image_path.suffix}"
        cv.imwrite(str(out_path), output_image)
        print(f"Saved: {out_path}")


if __name__ == "__main__":
    main()
