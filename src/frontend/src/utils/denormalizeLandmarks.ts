import { multiply } from "mathjs";

export default function denormalizeLandmarks(
  landmarks: number[],
  width: number,
  height: number
) {
  if (!landmarks.length) return [];

  //  Denormalize
  const mid = Math.floor(landmarks.length / 2);
  const firstHalf = landmarks.slice(0, mid); // normalized x values
  const secondHalf = landmarks.slice(mid); // normalized y values
  const length = Math.min(firstHalf.length, secondHalf.length);

  const denormalizedX = multiply(firstHalf, width) as number[];
  const denormalizedY = multiply(secondHalf, height) as number[];

  //   Turn into Coordinate Array
  const coordinateArray = denormalizedX
    .slice(0, length)
    .map((x, i) => [x, denormalizedY[i]]);

  return coordinateArray;
}
