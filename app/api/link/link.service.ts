import { FirebaseAdmin } from "@/lib/firebase/firebaseAdmin";
import { IUnsafeObject, ILink } from '@/shared/types';
const firebaseAdminInit = FirebaseAdmin.init();
const DB = firebaseAdminInit.getFireStore();
// import admin from "firebase-admin";

/**
 * CREATE Link
 // #region Create Link
 * @param linkInfo
 * @returns
 */
export async function createLink(linkInfo: ILink) {
    try {
        const collection = DB.collection(firebaseAdminInit.collections.links);
        const result = await collection.doc(linkInfo?.id).set(linkInfo);
        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Create Playlist ERROR: ", message);
        throw error;
    }
}

/**
 * UPDATE LINK
 // #region Update Link
 * @param linkInfo
 * @returns
 */
export async function updateLink(linkId: string, linkInfo: Partial<ILink>) {
    try {
        const collection = DB.collection(firebaseAdminInit.collections.links);
        const result = await collection.doc(linkId).update(linkInfo as { [key: string]: any });
        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Update Link ERROR: ", message);
        throw error;
    }
}

/**
 * GET ALL LINKS
 // #region Get All Links
 * @param profile id
 * @returns
 */
export async function getAllLinks(userId: string) {
    try {
        const collection = DB.collection(firebaseAdminInit.collections.links);
        const result = await collection
            .where('user_id', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        const links = result.docs.map((doc) => doc.data());
        return links;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Update Link ERROR: ", message);
        throw error;
    }
}

/**
 * REMOVE LINK
 // #region Remove Link
 * @param link id
 * @returns
 */
export async function removeLink(linkId: string) {
    try {
        const collection = DB.collection(firebaseAdminInit.collections.links);
        const result = await collection.doc(linkId).delete();
        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Update Link ERROR: ", message);
        throw error;
    }
}