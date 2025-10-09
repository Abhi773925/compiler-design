import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const wordsArray = words.split(" ");

  const renderWords = () => {
    return (
      <motion.div>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: duration,
                delay: idx * 0.1,
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("", className)}>
      <div>
        <div className="text-black dark:text-white text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export const TypewriterEffect = ({ words, className, cursorClassName }) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const renderWords = () => {
    return (
      <div className="flex flex-wrap justify-center items-center">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block mr-2">
              {word.text.map((char, index) => (
                <motion.span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black`, word.className)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: (idx * word.text.length + index) * 0.05,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="text-center">
        <div className="font-bold leading-tight">{renderWords()}</div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
        className={cn(
          "ml-1 block rounded-sm w-[3px] h-8 md:h-12 lg:h-16 bg-orange-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
