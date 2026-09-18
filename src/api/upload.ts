import api from "./client";

export interface UploadImageResponse {
  message: string;

  image: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}

export async function uploadObservationImage(
  imageUri: string,
  token: string
): Promise<UploadImageResponse> {
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "observation.jpg",
    type: "image/jpeg",
  } as any);

  const response = await api.post(
    "/upload/observation",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}