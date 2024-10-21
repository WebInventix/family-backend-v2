const { JOI_Validations } = require("../../services/joi_services");
const { Bcrypt_Service } = require("../../services/bcrypt_services");
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Childrens } = require("../../models/ChildModel");
const { Family } = require("../../models/family");
const { Calendar_Schema } = require("../../models/calender_model");
const User_DTO = require("../../dto/user_dto");
const { sendWelcomeEmailCoParent } = require("../../utils/email");
const { generateRandomPassword } = require("../../utils/passwordGenerator");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51P6NSDLLTNpiEfk0rkoX3uknyxdmYuyZ8fOehfC4JCWH96jnI39KLYRRnizC76gYN1Cxby9WwFp0wRzE7ihTgRKw00bjfMupP2"
);

const update_parent = async (req, res, next) => {
  const { body, user_id } = req;
  const { first_name, last_name, address, dob, gender } = body;

  try {
    // Fetch the user by ID
    const findUser = await User_Auth_Schema.findById(user_id);

    // Check if the user exists
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!first_name || !last_name || !address || !dob || !gender) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Update the user profile with new values
    findUser.first_name = first_name;
    findUser.last_name = last_name;
    findUser.address = address;
    findUser.dob = dob;
    findUser.gender = gender;

    // Save the updated user data
    await findUser.save({ validateBeforeSave: true });

    return res.json({ message: "User updated successfully", User: findUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const add_co_parent = async (req, res, next) => {
  const { body, user_id, user_data } = req;
  const { first_name, last_name, email, number, dob, gender, address } = body;

  if (!first_name || !last_name || !email) {
    return res
      .status(300)
      .json({ message: "First Name , Last Name Or Email is Missing" });
  }

  const is_email_exist = await User_Auth_Schema.exists({ email });
  if (is_email_exist) {
    const error = {
      status: 409,
      message: "User is already exist with this email!",
    };
    return next(error);
  }
  let password = generateRandomPassword();
  const secure_password = await Bcrypt_Service.bcrypt_hash_password(password);

  try {
    const newUser = new User_Auth_Schema({
      email,
      first_name,
      last_name,
      number,
      address,
      gender,
      dob,
      user_role: "Parent",
      password: secure_password,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a unique color code for the family
    const uniqueColorCode = generateRandomLightHexColorWithOpacity();

    const family = new Family({
      parent_1: user_id,
      parent_2: newUser._id,
      name: `${user_data.first_name}-${newUser.first_name}`,
      color_code: uniqueColorCode,
    });
    await family.save();
    await sendWelcomeEmailCoParent(email, first_name, password);
    return res
      .status(200)
      .json({ message: "Invitation Sent to User", newUser: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in Inviting user", error: error.message });
  }
};

// Function to generate a random hex color code
function generateRandomLightHexColorWithOpacity() {
  const letters = "CDEF"; // Constrain to lighter colors
  let color = "#";

  // Generate a light color by using letters from C to F for each color channel
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }

  // Add an alpha value for opacity (optional)
  // You can adjust the range from '00' to 'FF' where 'FF' is fully opaque.
  const opacity = "80"; // Example opacity value (50% opacity)

  // Combine the color with the opacity
  return color + opacity;
}

const getFamily = async (req, res, next) => {
  const { user_id } = req;

  try {
    const families = await Family.find({
      $or: [{ parent_1: user_id }, { parent_2: user_id }],
    })
      .populate("parent_1")
      .populate("parent_2")
      .lean();

    if (!families || families.length === 0) {
      return res.status(200).json({
        // status: "success",
        // message: "No families found for this user",
        data: [],
      });
    }

    // Fetch children for each family concurrently
    await Promise.all(
      families.map(async (family) => {
        const childrens = await Childrens.find({ family_id: family._id });

        family.childrens = childrens.length > 0 ? childrens : [];
      })
    );

    return res.status(200).json({
      status: "success",
      // message: "Family records found",
      data: families,
    });
  } catch (error) {
    // Handle any errors during the process
    return res.status(500).json({
      status: "error",
      message: "Error fetching family records",
      data: null,
      error: error.message,
    });
  }
};

const addChildren = async (req, res, next) => {
  const { body, user_id } = req;
  const {
    first_name,
    last_name,
    email,
    number,
    dob,
    children_info,
    gender,
    family_id,
  } = body;

  if (!first_name || !last_name || !email || !dob) {
    return res.status(300).json({
      message: "First Name , Last Name, Date of Birth Or Email is Missing",
    });
  }
  // const validation_error = JOI_Validations.children_joi_validation(body);
  // if (validation_error) {
  //   console.log("validation", "Error");
  //   return next(validation_error);
  // }

  const is_email_exist = await User_Auth_Schema.exists({ email });

  if (is_email_exist) {
    const error = {
      status: 409,
      message: "A Child already exist with this email!",
    };
    return next(error);
  }

  try {
    const coParent = await User_Auth_Schema.find({ added_by: user_id });
    if (coParent.length > 0) {
      var coParentId = coParent[0]._id;
    }

    const child = new Childrens({
      first_name,
      last_name,
      email,
      number,
      dob,
      children_info,
      gender,
      family_id: family_id,
    });

    await child.save();

    let allChilds = await Childrens.find({ family_id: family_id });
    return res
      .status(200)
      .json({ message: "Child Added Successfully", allChilds: allChilds });
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
};

const ActivateAccount = async (req, res, next) => {
  const { body, user_id } = req;
  console.log("yes");
  let mySelf = await User_Auth_Schema.find({ _id: user_id });
  let coParent = await User_Auth_Schema.find({ added_by: user_id });
  let childrens = await Childrens.find({ added_by: user_id });
  let data = { me: mySelf, parent: coParent, childrens: childrens };
  // return res.status(200).json({message:"Account Activated Successfully",data:data,id:user_id})
  try {
    if (
      (mySelf[0].stripePaymentMethodId !== null ||
        mySelf[0].stripePaymentMethodId !== "") &&
      coParent.length > 0 &&
      childrens.length > 0
    ) {
      //logic here
      await User_Auth_Schema.updateOne(
        { _id: user_id },
        { profile_status: "Complete" }
      );
      await User_Auth_Schema.updateOne(
        { _id: coParent[0]._id },
        { profile_status: "Complete" }
      );
      var user = await User_Auth_Schema.findById(user_id);
      return res
        .status(200)
        .json({ message: "Profile Completed Successfully", data: user });
    } else {
      return res
        .status(500)
        .json({ message: "Please Complete Your Profile First" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const ActivatePackage = async (req, res) => {
  const { body, user_id } = req;
  const { package, status } = body;
  try {
    var mySelf = await User_Auth_Schema.findByIdAndUpdate(
      user_id,
      {
        package: package,
        verified: true,
        subscription_status: status,
      },
      { new: true } // This option ensures that the updated document is returned
    );

    if (!mySelf) {
      return res.status(404).json({ message: "User not found" });
    }
    var coParent = await User_Auth_Schema.findOne({ added_by: user_id });
    coParent.package = package;
    coParent.verified = true;
    coParent.subscription_status = status;
    await coParent.save();
    return res
      .status(200)
      .json({ message: "Package activated successfully", user: mySelf });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editChildren = async (req, res) => {
  const { child_id } = req.body;

  const updateData = { ...req.body };
  delete updateData.child_id;

  try {
    const updatedChild = await Childrens.findByIdAndUpdate(
      child_id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedChild) {
      return res.status(404).json({ message: "Children not found" });
    }

    return res.json({
      message: "Updated successfully!",
      data: updatedChild,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const editCoparent = async (req, res) => {
  const { parent_id } = req.body;

  const updateData = { ...req.body };
  delete updateData.parent_id;

  try {
    const updatedParent = await User_Auth_Schema.findByIdAndUpdate(
      parent_id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedParent) {
      return res.status(404).json({ message: "CoParent not found" });
    }

    return res.json({
      message: "Updated successfully!",
      data: updatedParent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  const { user_id } = req;

  const updateData = { ...req.body };
  delete updateData.user_id;

  try {
    const updatedParent = await User_Auth_Schema.findByIdAndUpdate(
      user_id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedParent) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Updated successfully!",
      data: updatedParent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteChildren = async (req, res) => {
  const { child_id } = req.params;

  try {
    const deletedEvent = await Childrens.findByIdAndDelete(child_id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Children not found" });
    }

    return res.json({
      message: "Deleted successfully!",
      data: deletedEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getChildrenById = async (req, res) => {
  const { child_id } = req.params;
  try {
    const child = await Childrens.findById(child_id);
    if (!child) {
      return res.status(404).json({ message: "Children not found" });
    }
    return res.json({ message: "Children found", data: child });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const userById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User_Auth_Schema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const create_calendar_event = async (req, res) => {
  const {
    user_id,
    child_id,
    name,
    startDate,
    endDate,
    isMeeting,
    place,
    notes,
    attachment,
  } = req.body;

  try {
    let childInfo = await Childrens.findById(child_id);
    if (!childInfo) {
      return res.status(404).json({ message: "Child not found" });
    }

    const events = {
      user_id,
      child_id,
      name,
      startDate,
      endDate,
      isMeeting,
      place,
      notes,
      attachment,
      family_id: childInfo.family_id,
    };
    const events_data = await Calendar_Schema.create({
      ...events,
    });

    return res.json({
      message: "Create successfully!",
      data: events_data,
    });
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
};

const get_calendar_event_by_id = async (req, res) => {
  const { event_id } = req.params;

  try {
    const job_post_variable = await Calendar_Schema.findById({
      _id: event_id,
    }).populate("family");
    return res.json({
      message: "Got successfully!",
      data: job_post_variable,
    });
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
};

const get_calendar_event = async (req, res) => {
  const { family_id } = req.params;

  if (!family_id) {
    return res.status(404).json({ message: "Family Id  is required" });
  }

  let family = await Family.findById(family_id);
  try {
    let job_post_variable;

    job_post_variable = await Calendar_Schema.find({
      $or: [{ user_id: family.parent_1 }, { user_id: family.parent_2 }],
    });

    return res.json({
      message: "Create successfully!",
      data: job_post_variable,
    });
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
};

const delete_calendar_event = async (req, res) => {
  const { event_id } = req.params;

  try {
    const deletedEvent = await Calendar_Schema.findByIdAndDelete(event_id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({
      message: "Deleted successfully!",
      data: deletedEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const edit_calendar_event = async (req, res) => {
  const { event_id } = req.body;

  const updateData = { ...req.body };
  delete updateData.event_id;

  try {
    const updatedEvent = await Calendar_Schema.findByIdAndUpdate(
      event_id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({
      message: "Updated successfully!",
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  update_parent,
  add_co_parent,
  addChildren,
  ActivateAccount,
  editChildren,
  deleteChildren,
  getChildrenById,
  ActivatePackage,
  editCoparent,
  userById,
  editUser,
  getFamily,
  create_calendar_event,
  get_calendar_event,
  get_calendar_event_by_id,
  delete_calendar_event,
  edit_calendar_event,
};
