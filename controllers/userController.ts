import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../prisma/queries/User";

export const test = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { data } = req.body;
  try {
    const user = await User.get(data);
    if (!user) throw new Error("No user found");

    res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in test:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const testProtected = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) throw new Error("No user found");

    res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in testProtected:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const getUser = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  try {
    const user = await User.getById(Number(userId));
    if (!user) throw new Error("No user found");

    res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in getUser:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  try {
    const user = await User.getBasicInfo(Number(userId));
    if (!user) throw new Error("User not found.");

    res.json({ user });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in getUser:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const putUserName = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    await User.changeName(Number(userId), name);
    res.status(200).json({ msg: "Name updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserName:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const putUserEmail = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  const { email } = req.body;

  try {
    await User.changeEmail(Number(userId), email);
    res.status(200).json({ msg: "Email updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserEmail:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const putUserUserName = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  const { username } = req.body;

  try {
    await User.changeUserName(Number(userId), username);
    res.status(200).json({ msg: "Username updated successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in putUserUserName:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};

export const putUserPass = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId } = req.params;
  const { oldPass, newPass } = req.body;

  try {
    if (!req.user) throw new Error("Unauthorized access.");
    const matched = await bcrypt.compare(oldPass, req.user.password);
    if (!matched) throw new Error("Wrong password!");

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

export const delUser = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  try {
    if (!req.user) throw new Error("Unauthorized access.");
    await User.delete(req.user.id);
    res.status(204).json({ msg: "User deleted successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERROR in delUser:", err);
      res.status(500).json({ msg: err.message });
    }
  }
};
