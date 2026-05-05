import jwt from "jsonwebtoken";
const ACCESS_SECRET = "ACCESS_SECRET_KEY";
const REFRESH_SECRET = "REFRESH_SECRET_KEY";
export const createAccessToken = (userId) => {
    return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "5m" });
};
export const createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
