// @ts-ignore
import { parse } from "./parser";

export function evaluate(expression: string, options: Record<string, number>) {
  try {
    return expression
      .split("\n")
      .filter((line) => line.length != 0)
      .map((line) => format(parse(line, options)));
  } catch (e: any) {
    return [e.message];
  }
}

function format(minutes: number) {
  let result = "";
  let flag = false;
  if (minutes < 0) {
    result += "- ";
    minutes = -minutes;
  }
  if (minutes >= 60) {
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    result += hours + "h ";
    flag = true;
  }
  if (minutes >= 1) {
    var min = Math.floor(minutes / 1);
    minutes = minutes % 1;
    result += min + "m ";
    flag = true;
  }
  if (minutes > 0 || (minutes == 0 && !flag)) {
    result += Math.round(minutes * 60) + "s ";
  }
  return result;
}
