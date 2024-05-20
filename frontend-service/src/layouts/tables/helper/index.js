export const extractDeviceName = (fullName) => {
  return fullName?.split("/").pop();
};
