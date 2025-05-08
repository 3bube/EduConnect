// Helper for uploading an image file to imgbb and returning its URL
export async function uploadImage(file: File): Promise<string> {
  const apiKey = "YOUR_IMGBB_API_KEY"; // Replace with your imgbb API key
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Image upload failed");
  return data.data.url;
}