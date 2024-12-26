let file = $state<File | null>(null);
let image = $state<HTMLImageElement | null>(null);
let imageSize = $state({ width: 0, height: 0 });
let exportFile = $state<File | null>(null);

export const getFile = () => file;
export const getImage = () => image;
export const getImageUrl = () => image?.src;
export const getImageSize = () => imageSize;
export const getExportFile = () => exportFile;

export const setFile = (newFile: File) => {
	file = newFile;

	const newImage = new Image();
	newImage.onload = () => {
		image = newImage;
		imageSize = { width: image?.width ?? 0, height: image?.height ?? 0 };
	};
	newImage.src = URL.createObjectURL(file);
};

export const setExportFile = (newFile: File) => {
	exportFile = newFile;
};

export const resetUpload = () => {
	file = null;
	image = null;
	imageSize = { width: 0, height: 0 };
	exportFile = null;
};
