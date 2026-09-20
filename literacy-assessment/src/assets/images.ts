export const images = {
    brownGrid: "/brownGrid.png",
    apple: "/appleAsset.png",
    greenTape: "/greenTape.png",
    brownTape: "/brownTape.png",
    smiskiReading: "/smiskiReading.png",
    smiskiTeaching: "/smiskiTeaching.png",
    smiskiGarden: "/smiskiGarden.png",
    smiskiPaint: "/smiskiPaint.png",
} as const;

const heldImages: HTMLImageElement[] = [];
let preloadPromise: Promise<void> | null = null;

export function preloadImages() {
    if (preloadPromise) {
        return preloadPromise;
    }

    preloadPromise = Promise.all(
        Object.values(images).map((src) => {
            const image = new Image();
            image.src = src;
            heldImages.push(image);
            return image.decode().catch(() => undefined);
        })
    ).then(() => undefined);

    return preloadPromise;
}
