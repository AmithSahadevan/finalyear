import { motion } from "framer-motion";

export const NoiseButton = ({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <motion.button
            className={`relative overflow-hidden rounded-full bg-emerald-950 px-8 py-3.5 text-lg font-medium text-white shadow-xl transition-transform active:scale-95 ${className}`}
            whileHover={{ scale: 1.05 }}
            {...props as any}
        >
            {/* Noise Filter SVG */}
            <svg
                className="absolute inset-0 h-full w-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.85"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* Gradient Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-emerald-800/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

            {/* Top Highlight/Sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent opacity-50" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                {children}
            </span>
        </motion.button>
    );
};
