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

export function preloadImages() {
    Object.values(images).forEach((src) => {
        const image = new Image();
        image.src = src;
    });
}
