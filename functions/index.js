const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Mailjet = require("node-mailjet");


admin.initializeApp();

const db = admin.firestore()

// Get Mailjet API keys from Firebase environment variables
const MAILJET_API_KEY = functions.config().mailjet.apikey;
const MAILJET_SECRET_KEY = functions.config().mailjet.secretkey;

// Initialize the Mailjet client
const mailjet = new Mailjet({
  apiKey: MAILJET_API_KEY,
  apiSecret: MAILJET_SECRET_KEY
});

// Function to send email using Mailjet
const sendMail = async (email, password) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "joseph.ecktech@gmail.com", // Replace with your verified domain email
          Name: "Admin",
        },
        To: [
          {
            Email: email,
            Name: "User",
          },
        ],
        Subject: "Welcome to Our LCMS Service",
        TextPart: `Hello,\n\nWelcome to our service! Here are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\n\n\nBest regards,\nAdmin`,
      },
    ],
  });

  try {
    const response = await request;
    console.log(`Email sent to ${email}. Status: ${response.body.Messages[0].Status}`);
    return response.body;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

// Firebase Callable function to trigger email sending
exports.sendPasswordEmail = functions.https.onCall(async (data, context) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new functions.https.HttpsError("invalid-argument", "Email and password must be provided.");
  }

  try {
    const result = await sendMail(email, password);
    console.log(`Password email sent to ${email}`);
    return { success: true, message: "Email sent successfully", result };
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new functions.https.HttpsError("internal", "Failed to send email: " + error.message);
  }
});

// Function to manually count and update existing users in Firebase Authentication
exports.initializeUserCount = functions.https.onRequest(async (req, res) => {
  const userCountRef = db.collection('userCounts').doc('totalUsers');

  let totalUsers = 0;

  try {
    // List all existing users
    const listAllUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      totalUsers += result.users.length;
 
      // If there's more users, we recursively call the function
      if (result.pageToken) {
        await listAllUsers(result.pageToken);
      }
    };

    await listAllUsers(); // Start listing users

    // After counting users, update or set the totalUsers count in Firestore
    await userCountRef.set({ count: totalUsers }, { merge: true });

    console.log(`Successfully set user count to ${totalUsers}`);
    res.status(200).send(`User count initialized to ${totalUsers}`);
  } catch (error) {
    console.error("Error initializing user count:", error);
    res.status(500).send("Error initializing user count");
  }
});

// Function to increment user count when a new user is created
exports.incrementUserCount = functions.auth.user().onCreate(async (user) => {
  const userCountRef = db.collection('userCounts').doc('totalUsers');

  try {
    // Ensure that the document exists, create if not present
    const docSnapshot = await userCountRef.get();
    if (!docSnapshot.exists()) {
      await userCountRef.set({ count: 1 });
      console.log('Created initial user count document');
    } else {
      // Increment the count by 1
      await userCountRef.update({
        count: admin.firestore.FieldValue.increment(1),
      });
      console.log(`User added: ${user.email}. Incremented user count.`);
    }
  } catch (error) {
    console.error("Error incrementing user count:", error);
  }
});

// Function to decrement user count when a user is deleted
exports.decrementUserCount = functions.auth.user().onDelete(async (user) => {
  const userCountRef = db.collection('userCounts').doc('totalUsers');

  try {
    const docSnapshot = await userCountRef.get();
    if (docSnapshot.exists()) {
      // Decrement the count by 1
      await userCountRef.update({
        count: admin.firestore.FieldValue.increment(-1),
      });
      console.log(`User removed: ${user.email}. Decremented user count.`);
    } else {
      console.error('User count document does not exist.');
    }
  } catch (error) {
    console.error("Error decrementing user count:", error);
  }
});