import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FOOD_ITEMS = [
  "🍔","🍕","🌮","🌯","🥗","🍝","🍜","🍲","🍛","🍣",
  "🍱","🍤","🍙","🍚","🍘","🍥","🥠","🍢","🍡","🍧",
  "🍨","🍦","🥧","🍰","🎂","🍮","🍭","🍬","🍫","🍿",
  "🍩","🍪","🌰","🥜","🍯","🥛","🍵","☕","🥑","🍆",
  "🥔","🥕","🌽","🌶️","🥒","🥬","🥦","🍄","🥜","🥐",
];

export default function FoodBackground() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      icon: FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setItems(newItems);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, #1a1008 0%, #000 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(2px)",
          zIndex: 1,
        }}
      />
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: `${item.x}vw`, y: `${item.y}vh`, rotate: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [`${item.y}vh`, `${(item.y - 20 + 100) % 100}vh`],
            rotate: [0, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
          style={{
            position: "absolute",
            fontSize: `${item.size}px`,
            filter: "blur(1px)",
            zIndex: 0,
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}
