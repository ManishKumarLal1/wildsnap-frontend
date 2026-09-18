import { getToken } from "@/storage/authStorage";
import * as FileSystem from "expo-file-system/legacy";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UploadObservationResponse {
  message?: string;
  image: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}

async function getAuthHeaders() {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}


// --------------------------------
// Upload image to Cloudinary
// --------------------------------
// --------------------------------
// Upload image to backend
// --------------------------------

export async function uploadObservationImage(
  imageUri: string
) {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  console.log(
    "Uploading observation image:",
    imageUri
  );

  try {
    const response =
      await FileSystem.uploadAsync(
        `${API_URL}/upload/observation`,
        imageUri,
        {
          httpMethod: "POST",

          uploadType:
            FileSystem.FileSystemUploadType
              .MULTIPART,

          fieldName: "image",

          mimeType: "image/jpeg",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    console.log(
      "POST /upload/observation status:",
      response.status
    );

    console.log(
      "POST /upload/observation response:",
      response.body
    );

    let data: UploadObservationResponse;

    try {
      data =
        JSON.parse(response.body) as UploadObservationResponse;
    } catch {
      throw new Error(
        `Image upload returned an invalid response (${response.status}).`
      );
    }

    if (
      response.status < 200 ||
      response.status >= 300
    ) {
      throw new Error(
        data.message ||
          `Failed to upload image (${response.status})`
      );
    }

    if (
      !data.image?.url ||
      !data.image.publicId
    ) {
      throw new Error(
        "Image upload returned an incomplete server response."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Cloudinary image upload error:",
      error
    );

    throw error instanceof Error
      ? error
      : new Error(
          "Unable to upload the selected image."
        );
  }
}


// --------------------------------
// Create observation
// --------------------------------

export async function createObservation({
  speciesId,
  imageUrl,
  cloudinaryPublicId,
  confidence,
  latitude,
  longitude,
}: {
  speciesId: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  confidence: number;
  latitude?: number;
  longitude?: number;
}) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/observations`,
    {
      method: "POST",

      headers: {
        ...headers,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        speciesId,
        imageUrl,
        cloudinaryPublicId,
        confidence,
        latitude,
        longitude,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create observation"
    );
  }

  return data;
}

export async function getMyObservations() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/observations`,
    {
      method: "GET",
      headers,
    }
  );

  const responseText = await response.text();

  console.log(
    "GET /observations status:",
    response.status
  );

  console.log(
    "GET /observations response:",
    responseText
  );

  let data: any;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Server returned invalid response (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Failed to fetch observations (${response.status})`
    );
  }

  return data.observations;
}

export async function identifyAnimal(imageUrl: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/ai/identify`,
    {
      method: "POST",

      headers: {
        ...headers,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        imageUrl,
      }),
    }
  );

  const responseText = await response.text();

  console.log(
    "POST /ai/identify status:",
    response.status
  );

  console.log(
    "POST /ai/identify response:",
    responseText
  );

  let data: any;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `AI service returned an invalid response (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Animal identification failed (${response.status})`
    );
  }

  if (!data.success || !data.result) {
    throw new Error(
      "AI service returned an invalid identification result."
    );
  }

  return data;
}