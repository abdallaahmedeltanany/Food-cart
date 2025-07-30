import { ID } from "react-native-appwrite";
import { appWriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

import * as FileSystem from "expo-file-system";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appWriteConfig.dataBaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appWriteConfig.dataBaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appWriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appWriteConfig.bucketId, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.png`;
    const localUri = FileSystem.documentDirectory + fileName;

    const downloadResumable = FileSystem.createDownloadResumable(
      imageUrl,
      localUri
    );
    const downloadResult = await downloadResumable.downloadAsync();
    if (!downloadResult || !downloadResult.uri) {
      throw new Error("❌ Download failed or URI is undefined");
    }

    const fileId = ID.unique();

    const formData = new FormData();
    formData.append("fileId", fileId);
    formData.append("file", {
      uri: downloadResult.uri,
      name: fileName,
      type: "image/png",
    } as any);

    const res = await fetch(
      `${appWriteConfig.endpoint}/storage/buckets/${appWriteConfig.bucketId}/files`,
      {
        method: "POST",
        headers: {
          "X-Appwrite-Project": appWriteConfig.projectId,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(json));

    console.log("✅ File uploaded:", json);
    return `${appWriteConfig.endpoint}/storage/buckets/${appWriteConfig.bucketId}/files/${json.$id}/view?project=${appWriteConfig.projectId}`;
  } catch (error) {
    console.error("❌ uploadImageToStorage failed:", error);
    throw error;
  }
}

async function seed(): Promise<void> {
  // 1. Clear all
  console.log("seeding");
  await clearAll(appWriteConfig.categoriesCollectionId);
  await clearAll(appWriteConfig.customizationsCollectionId);
  await clearAll(appWriteConfig.menuCollectionId);
  await clearAll(appWriteConfig.menuCustomizationCollectionId);
  await clearStorage();

  // 2. Create Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await databases.createDocument(
      appWriteConfig.dataBaseId,
      appWriteConfig.categoriesCollectionId,
      ID.unique(),
      cat
    );
    categoryMap[cat.name] = doc.$id;
  }

  // 3. Create Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createDocument(
      appWriteConfig.dataBaseId,
      appWriteConfig.customizationsCollectionId,
      ID.unique(),
      {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      }
    );
    customizationMap[cus.name] = doc.$id;
  }

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const uploadedImage = await uploadImageToStorage(item.image_url);

    const doc = await databases.createDocument(
      appWriteConfig.dataBaseId,
      appWriteConfig.menuCollectionId,
      ID.unique(),
      {
        name: item.name,
        description: item.description,
        image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      }
    );

    menuMap[item.name] = doc.$id;

    // 5. Create menu_customizations
    for (const cusName of item.customizations) {
      await databases.createDocument(
        appWriteConfig.dataBaseId,
        appWriteConfig.menuCustomizationCollectionId,
        ID.unique(),
        {
          menu: doc.$id,
          customizations: customizationMap[cusName],
        }
      );
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
