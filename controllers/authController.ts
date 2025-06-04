// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require("dotenv").config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bcrypt'.
const bcrypt = require("bcryptjs");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const jwt = require("jsonwebtoken");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require("../prisma/queries/User");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Folder'.
const Folder = require("../prisma/queries/Folder");
const {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  SECURE_DEV,
  SAME_SITE_DEV,
  SECURE_PROD,
  SAME_SITE_PROD,
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
} = process.env;

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postSignup = async (req: any, res: any) => {
  const { name, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      name,
      username,
      // phone,
      email,
      hashedPassword
    );

    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const root = await Folder.createRoot(Number(user.id));

    res.status(200).json({ ...user, rootId: root.id });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    if (error.code === "P2002") {
      return res.status(400).json({
        msg: "Email, Phone or Username already exists. Please choose a different one.",
      });
    }
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error during signup: ", error.stack);
    res.status(500).json({ msg: "Failed to create user. Please try again." });
  }
};

// TOGGLE PROD/DEV CONFIG
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postLogin = async (req: any, res: any) => {
  const { data, password } = req.body;

  try {
    const user = await User.get(data);
    if (!user) return res.status(404).send("User not found!");

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).send("Invalid password!");

    const root = await Folder.getRootId(user.id);

    const { accessToken, refreshToken } = generateTokens({
      ...user,
      rootId: root.id,
    });

    // send set-cookie header with response
    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: SECURE_DEV, // true in production (only send over https)
      sameSite: SAME_SITE_DEV, // None in prod, Lax in dev
    });

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ msg: "Login Successful!", accessToken, user: decoded });
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error during login: ", error.stack);
    res.status(500).json({ msg: "Login failed. Please try again." });
  }
};

// TOGGLE PROD/DEV CONFIG
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postLogout = async (req: any, res: any) => {
  try {
    res.clearCookie("refreshCookie", {
      httpOnly: true,
      secure: SECURE_DEV, // true in production (only send over https)
      sameSite: SAME_SITE_DEV, // None in prod, Lax in dev
    });
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error during logout: ", error.stack);
    res.status(500).json({ msg: "Logout failed. Please try again." });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.getToken = async (req: any, res: any) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken)
    return res.status(403).json({ msg: "Invalid or expired token" });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ accessToken, user: decoded });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error verifying token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.verifyToken = (req: any, res: any, next: any) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) return res.status(500).send("Unauthorized access!");

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error verifying access token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.refresh = async (req: any, res: any) => {
  const refreshCookie = req.cookies.refreshCookie;

  if (!refreshCookie) {
    return res.status(401).json({ msg: "Unauthorized: No Token Found" });
  }

  try {
    const decoded = jwt.verify(refreshCookie, REFRESH_TOKEN);
    const user = await User.getById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const root = await Folder.getRootId(user.id);

    const { accessToken, refreshToken } = generateTokens({
      ...user,
      rootId: root.id,
    });

    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: SECURE_DEV, // true in production (only send over https)
      sameSite: SAME_SITE_DEV, // None in prod, Lax in dev
    });

    res.json({ msg: "Tokens Regenerated", accessToken });
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error refreshing token: ", error.stack);
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.verifyOwnership = (req: any, res: any, next: any) => {
  // @ts-expect-error TS(2304): Cannot find name 'Number'.
  const userId = Number(req.params.userId);
  if (userId !== req.user.id) {
    return res.status(403).json({ msg: "You don't have access rights" });
  }
  next();
};

// ACCESS TOKEN CONFIG
const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      rootId: user.rootId,
      name: user.name,
      username: user.username,
      // phone: user.phone,
      email: user.email,
      createdAt: user.createdAt,
    },
    ACCESS_TOKEN,
    { expiresIn: "10m" }
  );
  // console.log(accessToken);

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};
