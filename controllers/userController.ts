// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bcrypt'.
const bcrypt = require("bcryptjs");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require("../prisma/queries/User");

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.test = async (req: any, res: any) => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in test:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.testProtected = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in testProtected:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.getUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in getUser:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.getUserInfo = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const user = await User.getBasicInfo(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });
    res.status(200).json(user);
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in getUser:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.putUserName = async (req: any, res: any) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await User.changeName(Number(userId), name);
    res.status(200).json({ msg: "Name updated successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in putUserName:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.putUserEmail = async (req: any, res: any) => {
  const { userId } = req.params;
  const { email } = req.body;

  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await User.changeEmail(Number(userId), email);
    res.status(200).json({ msg: "Email updated successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in putUserEmail:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.putUserUserName = async (req: any, res: any) => {
  const { userId } = req.params;
  const { username } = req.body;

  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await User.changeUserName(Number(userId), username);
    res.status(200).json({ msg: "Username updated successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in putUserUserName:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// exports.putUserPhone = async (req, res) => {
//   const { userId } = req.params;
//   const { phone } = req.body;

//   try {
//     await User.changePhone(Number(userId), phone);
//     res.status(200).json({ msg: "Phone updated successfully!" });
//   } catch (err) {
//     console.error("ERROR in putUserPhone:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.putUserPass = async (req: any, res: any) => {
  const { userId } = req.params;
  const { oldPass, newPass } = req.body;

  try {
    // check old password
    // console.log(req.user);
    const matched = await bcrypt.compare(oldPass, req.user.password);
    if (!matched) return res.status(400).json({ msg: "Wrong password!" });

    // change the password
    const hashedPass = await bcrypt.hash(newPass, 10);
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await User.changePass(Number(userId), hashedPass);
    res.status(200).json({ msg: "Password updated successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in putUserPass:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.delUser = async (req: any, res: any) => {
  try {
    await User.delete(req.user.id);
    res.status(204).json({ msg: "User deleted successfully" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("ERROR in delUser:", err);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: err.message });
  }
};
