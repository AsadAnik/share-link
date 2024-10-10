import { FirebaseAdmin } from '@/lib/firebase/firebaseAdmin';
import {
    IUnsafeObject,
    IUserProfile,
} from '@/shared/types';
const firebaseAdminInit = FirebaseAdmin.init();
const DB = firebaseAdminInit.getFireStore();


/**
 * Get Profile by User ID
 * @param uid 
 * @returns 
 */
// region Get Profile
export async function getUserProfile(uid: string) {
    try {
        const result = await DB.collection(firebaseAdminInit.collections.profiles).doc(uid).get();
        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Get Profile ERROR: ", message);
        throw error;
    }
}

/**
 * Update Profile or Create Profile If Not Exist
 * @param profileInfo 
 * @returns 
 */
// region Update Profile
export async function updateProfile(uid: string, profileInfo: IUserProfile) {
    try {
        const result = await DB.collection(firebaseAdminInit.collections.profiles)
            .doc(uid)
            .set(profileInfo, { merge: true });

        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Update Profile ERROR: ", message);
        throw error;
    }
}

/**
 * Uploading Profile Image Or Change Image
 * @param uid 
 * @param imageUrl 
 */
// region Upload Profile Image
export async function uploadProfileImage(uid: string, profileInfo: IUserProfile) {
    const firebase = FirebaseAdmin.init();
    const firestore = firebase.getFireStore();
    // const storage = firebase.getStorage();

    try {
        const collection = firestore.collection(firebaseAdminInit.collections.profiles);

        if (profileInfo?.image) {
            const fileName = `${uid}-${Date.now()}`;
            const imageBuffer = profileInfo.image as Buffer;

            // Upload image to storage and get the public URL
            profileInfo.photoUrl = await firebase.storeFile({
                folderName: 'profile-images',
                fileName,
                file: imageBuffer,
                type: 'image/jpeg',
            });

            // Remove the image buffer to prevent storing it in Firestore
            delete profileInfo.image;

            // Update the Firestore document
            await collection.doc(uid).set(profileInfo, { merge: true });

            return profileInfo;
        } else {
            throw new Error('No image provided.');
        }
    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Delete User ERROR: ", message);
        throw error;
    }
}

/**
 * Delete User and Profile
 * @param uid 
 * @returns 
 */
// region Delete User
export async function deleteUser(uid: string) {
    try {
        const batch = DB.batch();

        // Delete/Wipe User Links..
        const linksSnapshot = await DB.collection(firebaseAdminInit.collections.links)
            .where('uid', '==', uid)
            .get();

        if (!linksSnapshot.empty) {
            linksSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
        }

        // Delete User Profile
        const profileDoc = DB.collection(firebaseAdminInit.collections.profiles).doc(uid);
        batch.delete(profileDoc);

        await batch.commit();

        // Delete User authentication (from Firebase Auth)
        const auth = firebaseAdminInit.getAuth();
        await auth.deleteUser(uid);

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Delete User ERROR: ", message);
        throw error;
    }
}