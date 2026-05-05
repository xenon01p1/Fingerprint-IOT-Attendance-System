import jwt from "jsonwebtoken";

const ACCESS_SECRET = "ACCESS_SECRET_KEY";
const REFRESH_SECRET = "REFRESH_SECRET_KEY";

export const createAccessToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, ACCESS_SECRET, { expiresIn: "5m" });
};

export const createRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
