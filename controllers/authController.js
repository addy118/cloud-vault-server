require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../prisma/queries/User");
const Folder = require("../prisma/queries/Folder");
const { ACCESS_TOKEN, REFRESH_TOKEN, IS_PROD } = process.env;
const isProd = IS_PROD == "true" ? true : false;

// auth/signup
exports.postSignup = async (req, res) => {
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

    const root = await Folder.createRoot(Number(user.id));

    res.status(200).json({ ...user, rootId: root.id });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        msg: "Email, Phone or Username already exists. Please choose a different one.",
      });
    }
    console.error("Error during signup: ", error.stack);
    res.status(500).json({ msg: "Failed to create user. Please try again." });
  }
};

// TOGGLE PROD/DEV CONFIG
// auth/login
exports.postLogin = async (req, res) => {
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
      secure: isProd, // true in production (only send over https)
      sameSite: isProd ? "None" : "Lax", // None in prod, Lax in dev
    });

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ msg: "Login Successful!", accessToken, user: decoded });
  } catch (error) {
    console.error("Error during login: ", error.stack);
    res.status(500).json({ msg: "Login failed. Please try again." });
  }
};

// TOGGLE PROD/DEV CONFIG
// auth/logout
exports.postLogout = async (req, res) => {
  try {
    res.clearCookie("refreshCookie", {
      httpOnly: true,
      secure: isProd, // true in production (only send over https)
      sameSite: isProd ? "None" : "Lax", // None in prod, Lax in dev
    });
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout: ", error.stack);
    res.status(500).json({ msg: "Logout failed. Please try again." });
  }
};

// auth/token
exports.getToken = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken)
    return res.status(403).json({ msg: "Invalid or expired token" });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    return res.json({ accessToken, user: decoded });
  } catch (err) {
    console.error("Error verifying token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// auth/refresh
exports.refresh = async (req, res) => {
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
      secure: isProd, // true in production (only send over https)
      sameSite: isProd ? "None" : "Lax", // None in prod, Lax in dev
    });

    res.json({ msg: "Tokens Regenerated", accessToken });
  } catch (error) {
    console.error("Error refreshing token: ", error.stack);
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
};

// middleware
exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) return res.status(500).send("Unauthorized access!");

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying access token: ", err.stack);
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// middleware
exports.verifyOwnership = (req, res, next) => {
  const userId = Number(req.params.userId);
  if (userId !== req.user.id) {
    return res.status(403).json({ msg: "You don't have access rights" });
  }
  next();
};

// ACCESS TOKEN CONFIG
// util
const generateTokens = (user) => {
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
