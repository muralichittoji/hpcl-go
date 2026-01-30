export const testInternetSpeed = async (): Promise<number> => {
	try {
		const start = Date.now();

		await fetch("https://www.google.com/images/phd/px.gif", {
			cache: "no-store",
		});

		const end = Date.now();

		const duration = (end - start) / 1000; // seconds
		const sizeInMB = 100.5;

		const speed = sizeInMB / duration;
		alert(speed);
		return speed;
	} catch {
		return 0;
	}
};
