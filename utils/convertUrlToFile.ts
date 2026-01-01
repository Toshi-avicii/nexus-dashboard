export async function convertUrlToFile(url: string): Promise<File> {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const fileName = url.split('/').pop()?.split('.')[0] || 'image';
    const file = new File([blob], fileName, { type: blob.type });
    return file
}