import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/client";
import styled from "https://esm.sh/styled-components";

const { useRef, useEffect, useState } = React;

const Svg = styled.svg`
    user-select: none;
    width: 100%;
    aspect-ratio: 100 / 12;
    overflow: visible;
    display: block;
    font-size: 9.6rem;
    font-weight: 700;
    font-family: 'Cairo', sans-serif; /* استخدم خط القاهرة ليناسب العربية */
    letter-spacing: 5px;
    text-transform: uppercase;
    line-height: 1;
`;

const Jacket = styled.div`
    background: #e0e6e9; /* خلفية متناسقة مع التصميم الجديد */
    min-height: 100vh; /* This should be handled by the hero section in HTML */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const App = () => {
    // The text that will be repeated in the marquee animation
    const marqueeText = 'مخيم الرباط الطبعة الثانية ✦ '; // تم التعديل إلى "مخيم الرباط الطبعة الثانية"
    
    // Unique identifier for the curved path that the text will follow
    const pathId = 'customCurve';
    
    // Distance between each repeated text instance (in pixels)
    const textSpacing = 2480; // قد تحتاج لتعديل هذه القيمة بناءً على طول النص وحجم الخط
    
    // Refs to store references to each text span element for animation control
    const tspansRef = useRef([]);
    
    // State to store the total length of the curved path
    const [pathLength, setPathLength] = useState(1000);
    
    // Ref to access the SVG path element
    const pathRef = useRef(null);
    
    // Effect to calculate and store the actual length of the curved path
    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
        }
    }, []);
    
    // Effect to create the continuous marquee animation
    useEffect(() => {
        let animationFrame;
        
        const move = () => {
            tspansRef.current.forEach((tspan, i) => {
                if (!tspan) return;
                
                let x = parseFloat(tspan.getAttribute('x'));
                x -= 1; // يتحكم في سرعة الحركة
                
                if (x < -textSpacing) {
                    x = (tspansRef.current.length - 1) * textSpacing;
                }
                
                tspan.setAttribute('x', x);
            });
            
            animationFrame = requestAnimationFrame(move);
        };
        
        move();
        
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    
    const repeats = Math.ceil(pathLength / textSpacing) + 2;
    
    return (
        <Jacket>
            <Svg viewBox="0 0 1440 120">
                <defs>
                    <path ref={pathRef} id={pathId} d="M-100,40 Q500, 300 1540,40" fill="none" stroke="transparent" />
                </defs>
                <text fill="#222" fontWeight="bold">
                    <textPath href={`#${pathId}`}>
                        {Array.from({ length: repeats }).map((_, i) => (
                            <tspan
                                key={i}
                                x={i * textSpacing}
                                ref={el => (tspansRef.current[i] = el)}
                                style={{ fontFamily: 'Cairo, sans-serif' }}
                            >
                                {marqueeText}
                            </tspan>
                        ))}
                    </textPath>
                </text>
            </Svg>
        </Jacket>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);