import express from "express"

import { sendEmail } from "../controllers/generateMail.js";
import { getUserById } from "../controllers/users.js";

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    console.log("inside this mail func >.")
    console.log("req data >>>", req.body)
    let {name="",breed="",age="",color="",location="",shelterId="", type= "", message=""} = req?.body
    let fetchUserDetailsById = await getUserById(shelterId)
        if (!fetchUserDetailsById) {
            return res.status(400).json({ "message": "No User ID Found" })
        }
        let sendMail = await sendEmail(
            fetchUserDetailsById?.email,
            `${type} - REQUEST`,
            `
    <p>Hello ${fetchUserDetailsById?.name},</p>

    <h5>for : ${type}</h5>
    <p>Here are the details of the pet:</p>

    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
      <tr style="background-color: #f4f4f4;">
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Property</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Value</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Breed</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${breed}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Age</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${age}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Location</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${location}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Color</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${color}</td>
      </tr>
        <tr>
        <td style="padding: 12px; border: 1px solid #ddd;">Message</td>
        <td style="padding: 12px; border: 1px solid #ddd;">${message}</td>
      </tr>
    </table>

    <p>Best regards,<br/>Pet Adoption Team</p>
    `
        );

        if (sendMail.message === "mail successfully sent") {
            return res.status(200).json({ "message": "success" })
        }


    }

  catch (error) {
    console.log("error occured >>>",error)
        return res.status(500).json({ error: "Internal Server Error" });
    }

})

router.post("/accept-reject", async (req, res) => {
  try {
    console.log("inside this mail func >.");
    console.log("req data >>>", req.body);

    let { name = "", breed = "", age = "", color = "", location = "", shelterId = "", type = "", message = "", isAccepted } = req?.body;

    let fetchUserDetailsById = await getUserById(shelterId);
    if (!fetchUserDetailsById) {
      return res.status(400).json({ message: "No User ID Found" });
    }

    const statusMessage = isAccepted
      ? `<p style="color: green; font-size: 16px; font-weight: bold;">Your request has been accepted! 🎉</p>`
      : `<p style="color: red; font-size: 16px; font-weight: bold;">Unfortunately, your request was rejected by the shelter. 😔</p>`;

    let sendMail = await sendEmail(
      fetchUserDetailsById?.email,
      `${type} - Request ${isAccepted ? "Accepted ✅" : "Rejected ❌"}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border-radius: 8px; background-color: #f9f9f9; border: 1px solid #ddd;">
        <p style="font-size: 18px; font-weight: bold; color: #333;">Hello ${fetchUserDetailsById?.name},</p>

        ${statusMessage}

        <h3 style="color: #2C3E50;">Pet Details</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; background-color: #fff;">
          <tr style="background-color: #f4f4f4;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Property</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Value</th>
          </tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Name</td><td style="padding: 10px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Breed</td><td style="padding: 10px; border: 1px solid #ddd;">${breed}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Age</td><td style="padding: 10px; border: 1px solid #ddd;">${age}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Location</td><td style="padding: 10px; border: 1px solid #ddd;">${location}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Color</td><td style="padding: 10px; border: 1px solid #ddd;">${color}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd;">Message</td><td style="padding: 10px; border: 1px solid #ddd;">${message}</td></tr>
        </table>

        <p style="font-size: 16px; color: #555;">For any further inquiries, feel free to contact us.</p>

        <p style="font-size: 16px; font-weight: bold; color: #2C3E50;">Best regards,<br/>Pet Adoption Team</p>
      </div>
      `
    );

    if (sendMail.message === "mail successfully sent") {
      return res.status(200).json({ message: "success" });
    }

  } catch (error) {
    console.log("error occurred >>>", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




export const mailRouter = router;