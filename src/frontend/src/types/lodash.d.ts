declare module "lodash" {
  export function debounce(
    func: (...args: any[]) => any,
    wait?: number
  ): (...args: any[]) => any;

  export function inRange(
    value: number,
    start?: number,
    end?: number
  ): boolean;
}
