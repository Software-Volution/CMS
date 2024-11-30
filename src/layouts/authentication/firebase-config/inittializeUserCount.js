import * as admin from('firebase-admin');
import { getFirestore } from('firebase-admin/firestore');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./lcms.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

async function initializeUserCount() {
  let totalUsers = 0;

  async function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time
    const result = await admin.auth().listUsers(1000, nextPageToken);
    totalUsers += result.users.length;

    if (result.pageToken) {
      // If there are more users, recursively list them
      await listAllUsers(result.pageToken);
    }
  }

  await listAllUsers();

  // Store the user count in Firestore
  await db.collection('userCounts').doc('totalUsers').set({
    count: totalUsers,
  });

  console.log(`Total Users in Firebase Auth: ${totalUsers}`);
}

initializeUserCount();
