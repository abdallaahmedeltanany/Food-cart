import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appWriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.jsm.foodcart",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  dataBaseId: "687ea3ef001cd0a620da",
  bucketId: "688683d10001f2fd820b",
  userCollectionId: "687ea402002b115754b4",
  categoriesCollectionId: "68864bd7001ed43f08b8",
  menuCollectionId: "68864f1c0033940e1e6b",
  customizationsCollectionId: "6886534e001fb3ced769",
  menuCustomizationCollectionId: "688655a5000941fcb1b1",
};

export const client = new Client();

client
  .setEndpoint(appWriteConfig.endpoint)
  .setProject(appWriteConfig.projectId)
  .setPlatform(appWriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);
// createing new user
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appWriteConfig.dataBaseId,
      appWriteConfig.userCollectionId,
      newAccount.$id,
      {
        email,
        name,
        acountId: newAccount.$id,
        avatar: avatarUrl,
      }
    );
  } catch (error: any) {
    throw new Error(error?.message || "Error creating user");
  }
};

//signing in

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error?.message || "Error signing in");
  }
};

// getting user
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appWriteConfig.dataBaseId,
      appWriteConfig.userCollectionId,
      [Query.equal("acountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    console.log(e);
    throw new Error(e as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appWriteConfig.dataBaseId,
      appWriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appWriteConfig.dataBaseId,
      appWriteConfig.categoriesCollectionId
    );

    return categories.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};
