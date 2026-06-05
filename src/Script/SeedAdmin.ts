import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function SeedAdmin() {
  try {
    console.log("Admin seeding started");
    const adminData = {
      name: "Tanim",
      email: "tanim123@gmail.com",
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
      console.log("Admin user already exists. Stopping seed.");
      return; 
    }

 
    console.log("Sending sign-up request to API...");
    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
          "Referer": "http://localhost:3000/"
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("Admin created via API");
      
    
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("Email verification updated successfully.");
    } else {
      const errorText = await signUpAdmin.text();
      console.error("Failed to create admin user via API. Response:", errorText);
    }
    
    console.log("Success!!!!");
  } catch (error) {
    console.error("An error occurred during seeding:", error);
  } finally {

    await prisma.$disconnect();
  }
}

SeedAdmin();