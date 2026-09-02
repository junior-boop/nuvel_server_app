type objectType = {
  size: number;
  minetype: string;
  lastmodified: number;
  originalname: string;
  name: string;
};

export const Millisecond = (millisecond: number, seconds: number) => {
  if (millisecond < 10) return `${seconds}000${millisecond}`;
  if (millisecond < 100) return `${seconds}00${millisecond}`;
  if (millisecond < 1000) return `${seconds}0${millisecond}`;
  return `${seconds}${millisecond}`;
};

export function MinutesTime() {
  const date = new Date();
  const getHour = date.getHours();
  const getMinute = date.getMinutes();
  const getMillisecond = date.getMilliseconds();
  const getSecond = date.getSeconds();

  const minuteConverts = getHour * 60 + getMinute;

  const seconds = Millisecond(getMillisecond, getSecond);

  if (minuteConverts < 10) return `${seconds}000${minuteConverts}`;
  if (minuteConverts < 100) return `${seconds}00${minuteConverts}`;
  if (minuteConverts < 1000) return `${seconds}0${minuteConverts}`;
  return `${seconds}${minuteConverts}`;
}

export function DateForme() {
  const date = new Date();
  const getDate = date.getDate();
  const getMonth = date.getMonth();
  const getYears = date.getFullYear();

  const day = getDate < 10 ? `0${getDate}` : getDate;
  const month = getMonth < 10 ? `0${getMonth}` : getMonth;

  return `${day}${month}${getYears}`;
}

export default function Metadata_images(image: File) {
  const object: objectType = {};
  object.size = image.size;
  object.minetype = image.type;
  object.lastmodified = image.lastModified;
  object.originalname = image.name;

  let imagetitre = `IMG${MinutesTime()}-${DateForme()}`;

  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/bmp": "bmp",
    "image/svg+xml": "svg",
  };

  let extension = mimeToExt[image.type];

  if (!extension && object.originalname?.includes(".")) {
    extension = object.originalname.split(".").at(-1) as string;
  }

  if (!extension) {
    extension = "jpg";
  }

  object.name = `${imagetitre}.${extension}`;
  return object;
}

export function Metadata_files(image: File) {
  const object: objectType = {};
  object.size = image.size;
  object.minetype = image.type;
  object.lastmodified = image.lastModified;
  object.originalname = image.name;

  let imagetitre = `FILES${MinutesTime()}-${DateForme()}`;
  const extend = object.originalname.split(".");

  object.name = `${imagetitre}.${extend.at(-1)}`;

  return object;
}
