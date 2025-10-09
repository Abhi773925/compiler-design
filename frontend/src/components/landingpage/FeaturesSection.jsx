import React from "react";
import { motion } from "framer-motion";
import WorldMap from "../ui/world-map";

const FeaturesSection = () => {
  return (
    <div className="py-32 bg-white dark:bg-black w-full">
      <div className="max-w-6xl mx-auto text-center px-4">
        <motion.p
          className="font-bold text-2xl md:text-4xl text-black dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Remote{" "}
          <span className="text-orange-500 dark:text-orange-400">
            {"Connectivity".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.p>
        <motion.p
          className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Connect with developers worldwide. Collaborate in real-time from
          anywhere.
        </motion.p>
      </div>
      <motion.div
        className="max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <WorldMap
          dots={[
            {
              start: {
                lat: 37.7749,
                lng: -122.4194,
              }, // San Francisco
              end: {
                lat: 51.5074,
                lng: -0.1278,
              }, // London
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 40.7128, lng: -74.006 }, // New York
            },
            {
              start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
              end: { lat: 55.7558, lng: 37.6176 }, // Moscow
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default FeaturesSection;
