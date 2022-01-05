export const fileSize = (objFile) => {
  return sizeToString(objFile.size);
};

export const sizeToString = (size) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const bytes = size;
  let s;
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) {
    s = bytes + " " + sizes[i];
  } else {
    s = (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }
  return s;
};
