export const successFunc = res => {
  if (res.data && res.data.success) return res.data.data;
  throw new Error((res.data && res.data.message) || "API request error");
};

export const failFunc = (e: Error) => {
  console.log(e.message);
  throw new Error(e.message);
};
