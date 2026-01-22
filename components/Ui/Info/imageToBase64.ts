import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

export const imageToBase64 = async (imageModule: any) => {
	const asset = Asset.fromModule(imageModule);
	await asset.downloadAsync();

	return await FileSystem.readAsStringAsync(asset.localUri!, {
		encoding: 'base64',
	});
};
