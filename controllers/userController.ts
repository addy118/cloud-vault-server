import { Request, Response } from "express";
import {
  AuthRequest,
  BaseUserRes,
  CompleteUserRes,
  MsgRes,
} from "./controller.types";
import bcrypt from "bcrypt";
import User from "../prisma/queries/User";

exports.test = async (req: Request, res: Response): MsgRes => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) return res.status(404).json({ msg: "No user found" });

    return res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in test:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.testProtected = async (req: Request, res: Response): MsgRes => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });

    return res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in testProtected:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.getUser = async (req: Request, res: Response): CompleteUserRes => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) return res.status(404).json({ msg: "No user found" });

    return res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in getUser:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.getUserInfo = async (req: Request, res: Response): BaseUserRes => {
  const { userId } = req.params;
  try {
    const user = await User.getBasicInfo(Number(userId));
    if (!user) throw new Error("User not found.");

    return res.json({ user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in getUser:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.putUserName = async (req: Request, res: Response): MsgRes => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    await User.changeName(Number(userId), name);
    return res.status(200).json({ msg: "Name updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserName:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.putUserEmail = async (req: Request, res: Response): MsgRes => {
  const { userId } = req.params;
  const { email } = req.body;

  try {
    await User.changeEmail(Number(userId), email);
    return res.status(200).json({ msg: "Email updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserEmail:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.putUserUserName = async (req: Request, res: Response): MsgRes => {
  const { userId } = req.params;
  const { username } = req.body;

  try {
    await User.changeUserName(Number(userId), username);
    return res.status(200).json({ msg: "Username updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserUserName:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};

exports.putUserPass = async (req: AuthRequest, res: Response): MsgRes => {
  const { userId } = req.params;
  const { oldPass, newPass } = req.body;

  try {
    const matched = await bcrypt.compare(oldPass, req.user.password);
    if (!matched) return res.status(400).json({ msg: "Wrong password!" });

    const hashedPass = await bcrypt.hash(newPass, 10);

    await User.changePass(Number(userId), hashedPass);
    res.status(200).json({ msg: "Password updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserPass:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

exports.delUser = async (req: AuthRequest, res: Response): MsgRes => {
  try {
    await User.delete(req.user.id);
    return res.status(204).json({ msg: "User deleted successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in delUser:", err);
      return res.status(500).json({ msg: err.message });
    }
  }
};
