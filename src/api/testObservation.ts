import {
  uploadObservationImage,
} from "./observations";

export async function testUpload(imageUri: string) {
  try {
    const result =
      await uploadObservationImage(imageUri);

    console.log(
      "UPLOAD SUCCESS:",
      result
    );

    return result;
  } catch (error) {
    console.error(
      "UPLOAD FAILED:",
      error
    );

    throw error;
  }
}