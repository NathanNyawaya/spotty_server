import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const getUserData = async (req, res) => {
  console.log("fetching user data");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userData = await User.findById(decoded.id);

    if (!userData) {
      return res.status(200).json({
        statusCode: 404,
        message: "User not found",
      });
    } else {
      const { password, updatedAt, ...other } = userData._doc;
      res.status(200).json({
        other,
        statusCode: 200,
        message: "Successfully fetched user data",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAndProcessUserData = async (req, res, role) => {
  console.log(`fetching ${role} data`);
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const mainAdmins = await User.find({ role, createdBy: decoded.id });
    // const adminExposure = await totalExposure(decoded.id); // Await here

    if (mainAdmins.length > 0) {
      const filteredAdminsData = mainAdmins.map((admin) => {
        const { password, updatedAt, ...other } = admin._doc;
        return other;
      });

      res.status(200).json({
        adminsData: filteredAdminsData,
        statusCode: 200,
        message: "Successfully fetched user data",
      });
    } else {
      return res.status(200).json({
        statusCode: 404,
        message: "No user found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAndProcessUserDataControl = async (req, res, role) => {
  console.log(`fetching ${role} data`);
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.id);

    const usersToFetch = await User.find({
      role
    });

    if (usersToFetch.length > 0) {
      const filteredAdminsData = usersToFetch.map((admin) => {
        const { password, updatedAt, ...other } = admin._doc;
        return other;
      });

      res.status(200).json({
        adminsData: filteredAdminsData,
        statusCode: 200,
        message: "Successfully fetched user data",
      });
    } else {
      return res.status(200).json({
        statusCode: 404,
        message: "No user found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMainAdmins = async (req, res) => {
  await fetchAndProcessUserData(req, res, "mainAdmin");
};
export const getMainAdminsControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "mainAdmin");
};

export const getAdmins = async (req, res) => {
  await fetchAndProcessUserData(req, res, "admin");
};
export const getAdminsControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "admin");
};

export const getMasters = async (req, res) => {
  await fetchAndProcessUserData(req, res, "master");
};
export const getMasterControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "master");
};

export const getSupers = async (req, res) => {
  await fetchAndProcessUserData(req, res, "super");
};
export const getSupersControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "super");
};

export const getNormal = async (req, res) => {
  await fetchAndProcessUserData(req, res, "normalUser");
};
export const getNormalControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "normalUser");
};

export const getControlUsers = async (req, res) => {
  await fetchAndProcessUserData(req, res, "king");
};
export const getControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "king");
};

export const getAllUsers = async (req, res) => {
  console.log("fetching normal user data");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mainAdmins = await User.find();
    if (mainAdmins.length > 0) {
      const filteredAdminsData = mainAdmins.map((admin) => {
        const { password, updatedAt, ...other } = admin._doc;
        return other;
      });

      const adminsData = filteredAdminsData;

      res.status(200).json({
        adminsData,
        statusCode: 200,
        message: "Successfully fetched user data",
      });
    } else {
      return res.status(200).json({
        statusCode: 404,
        message: "No user found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPanelUsers = async (req, res) => {
  await fetchAndProcessUserData(req, res, "panel");
};
export const getPanelControl = async (req, res) => {
  await fetchAndProcessUserDataControl(req, res, "panel");
};

export const editUser = async (req, res) => {
  try {
    console.log("Editing user data");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const adminUser = await User.findById(decoded.id);
    if (!adminUser) {
      res.status(404).json({ message: "No admin User" });
    }

    const toUpdateData = req.body;

    const userToEdit = await User.findById(toUpdateData.user_id);
    if (!userToEdit) {
      return res.status(404).json({ message: "No user found" });
    }

    const {
      firstName,
      lastName,
      exposure,
      exposureLimit,
      partnership,
      creditRef,
    } = toUpdateData;
    // const controlUser = ;
    if (
      adminUser.availableBalance >= creditRef ||
      decoded.id === toUpdateData.user_id
    ) {
      userToEdit.firstName = firstName;
      userToEdit.lastName = lastName;
      userToEdit.exposure = exposure;
      userToEdit.exposureLimit = exposureLimit;
      userToEdit.partnership = partnership;
      userToEdit.creditRef += creditRef;
      userToEdit.availableBalance += creditRef;
      userToEdit.balance += creditRef;

      await userToEdit.save();

      if (decoded.id != toUpdateData.user_id) {
        adminUser.availableBalance -= creditRef;
        adminUser.balance -= creditRef;

        await adminUser.save();
      } else {
        adminUser.availableBalance += creditRef;
        adminUser.balance += creditRef;

        await adminUser.save();
      }

      res.status(200).json({
        statusCode: 200,
        message: "Successfully edited user data",
      });
    } else {
      res.status(200).json({
        statusCode: 400,
        message: "Insufficient Credits",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editUserControl = async (req, res) => {
  try {
    console.log("Editing user data");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const adminUser = await User.findById(decoded.id);
    if (!adminUser) {
      res.status(404).json({ message: "No admin User" });
    }

    const toUpdateData = req.body;

    const userToEdit = await User.findById(toUpdateData.user_id);
    if (!userToEdit) {
      return res.status(404).json({ message: "No user found" });
    }

    const {
      firstName,
      lastName,
      exposure,
      exposureLimit,
      partnership,
      creditRef,
      availableBalance,
      balance,
    } = toUpdateData;
    // const controlUser = ;
    if (
      adminUser.availableBalance >= creditRef ||
      decoded.id === toUpdateData.user_id
    ) {
      userToEdit.firstName = firstName;
      userToEdit.lastName = lastName;
      userToEdit.exposure = exposure;
      userToEdit.exposureLimit = exposureLimit;
      userToEdit.partnership = partnership;
      userToEdit.creditRef = creditRef;
      userToEdit.availableBalance = availableBalance;
      userToEdit.balance = balance;

      await userToEdit.save();

      adminUser.availableBalance = creditRef;
      adminUser.balance = creditRef;

      await adminUser.save();

      res.status(200).json({
        statusCode: 200,
        message: "Successfully edited user data",
      });
    } else {
      res.status(200).json({
        statusCode: 400,
        message: "Insufficient Credits",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
