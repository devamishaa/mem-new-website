"use client";
import { useEffect, useRef } from "react";
import { AnimationItem } from "lottie-web";
import animationData from "@/public/assets/close_icon_animation.json";


const CrossIconAnimation = () => {
    const container = useRef(null);
    const animationInstanceRef = useRef(null);

    useEffect(() => {
        import("lottie-web").then((Lottie) => {
            if (container.current && !animationInstanceRef.current) {
                animationInstanceRef.current = Lottie.default.loadAnimation({
                    container: container.current,
                    renderer: "svg",
                    loop: false,
                    autoplay: true,
                    animationData,
                });
            }
        });

        return () => {
            if (animationInstanceRef.current) {
                animationInstanceRef.current.destroy();
                animationInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-[31.67px] mr-2" ref={container} />
    );
};

export default CrossIconAnimation;
