// Easing function for smooth animation
export const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
};

