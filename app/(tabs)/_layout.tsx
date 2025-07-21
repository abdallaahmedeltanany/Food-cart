import { Redirect, Slot } from "expo-router";

const _Layout = () => {
  const isAuthenticated = true;
  if (isAuthenticated) return <Redirect href="/Signin" />;
  return <Slot />;
};

export default _Layout;
