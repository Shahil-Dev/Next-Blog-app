import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function SeedAdmin() {
  try {
    console.log("Admin seeding started");
    const adminData = {
      name: "Yemtehan Shahil12",
      email: "yemtehanShahil1280@gmail.com",
      role: Role.ADMIN,
      password: "Shahil 12345678",
    };
    console.log("Checking user existing or not");
    const ExistingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (ExistingUser) {
      console.log("Admin user already exists.");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("Admin created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    } else {
      console.error("Failed to create admin user.");

      console.log("email verification updated");
    }
    console.log("Success!!!!")
  } catch (error) {
    console.error(error);
  }
}

SeedAdmin();
