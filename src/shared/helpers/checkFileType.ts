const isImage = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      return true;
  }
  return false;
}

const isVideo = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true;
  }
  return false;
}

const isAudio = (extension: string) => {
  switch (extension.toLowerCase()) {
    case 'm4a':
    case 'wav':
    case 'wma':
    case 'mp3':
      return true;
  }
  return false;
}

export const getFileType = (extension: string) => {
  if (isImage(extension)) return 'image';
  if (isVideo(extension)) return 'video';
  if (isAudio(extension)) return 'audio';

  return 'other';
}
