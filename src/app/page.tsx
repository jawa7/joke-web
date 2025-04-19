"use client";

import { fetchWithBasicAuth } from "./utils/api";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { US, CZ, RU, KZ } from 'country-flag-icons/react/3x2';

type Joke = {
  id: any,
  text: string,
  x: number,
  y: number,
}

export default function Home() {
  const [latestJoke, setLatesJoke] = useState<string | undefined>(undefined);
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleFlagClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
  }

  useEffect(() => {
    let storeUserId = localStorage.getItem("userId")
    if (!storeUserId) {
      storeUserId = crypto.randomUUID();
      localStorage.setItem("userId", storeUserId);
    }

    setUserId(storeUserId);
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    let text = ""
    try {
      const res = await fetchWithBasicAuth(`${process.env.HOST}/api/joke?userId=${userId}`);
      console.log(res)
      console.log("asdasd")
      if (!res.data) {
        text = "No more jokes for today"
      } else {
        const data: { setup: string, punchline: string } = await res.data;
        text = `${data.setup} ${data.punchline}`
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      text = "Oops, something went wrong, Try again later!"

    } finally {
      setTimeout(() => {
        const joke: Joke = {
          id: crypto.randomUUID(),
          text: text,
          x: Math.random() * 90,
          y: Math.random() * 90 
        }
        setIsLoading(false);
        setLatesJoke(joke.text)
        setJokes((prev) => [...prev, joke])
      }, 3000);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
  
      {/* Floating jokes in background */}
      {jokes.map((joke) => (
        <motion.div
          key={joke.id}
          className="pointer-events-none text-lg opacity-30 absolute max-w-xs"
          style={{
            top: `${joke.y}vh`,
            left: `${joke.x}vw`,
          }}
          initial={{ y: 0 }}
          animate={{ y: [-30, 30, -30] }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {joke.text}
        </motion.div>
      ))}
  
      {/* Main grid content */}
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[16px] row-start-2">
          <div className="flex gap-4 items-center justify-center">
            <button onClick={() => handleFlagClick("US")} className="w-8 h-auto cursor-pointer hover:scale-110 transition-transform">
              <US title="United States" />
            </button>
            <button onClick={() => handleFlagClick("RU")} className="w-8 h-auto cursor-pointer hover:scale-110 transition-transform">
              <RU title="Russia" />
            </button>
            <button onClick={() => handleFlagClick("CZ")} className="w-8 h-auto cursor-pointer hover:scale-110 transition-transform">
              <CZ title="Czechia" />
            </button>
            <button onClick={() => handleFlagClick("KZ")} className="w-8 h-auto cursor-pointer hover:scale-110 transition-transform">
                <KZ title="Kazakhstan" />
            </button>
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row w-full justify-center">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={handleClick}
              disabled={isLoading}
            >
              {/* Conditional text based on country and loading state */}
              {isLoading ? (
                selectedCountry === "US" ? (
                  "Loading..."
                ) : selectedCountry === "RU" ? (
                  "Загрузка..."
                ) : selectedCountry === "CZ" ? (
                  "Počkej..."
                ) : selectedCountry === "KZ" ? (
                  "Күте тұрыңыз..."
                ) : (
                  "Loading..."
                )
              ) : selectedCountry === "US" ? (
                "Get a joke"
              ) : selectedCountry === "RU" ? (
                "Сгенерировать шутку"
              ) : selectedCountry === "CZ" ? (
                "Získejte vtip"
              ) : selectedCountry === "KZ" ? (
                "Әзіл алыңыз"
              ) : (
                "Get a joke"
              )}
            </button>
          </div>
  
          <div className="flex gap-4 items-center flex-col sm:flex-row w-full justify-center relative min-h-[30px]">
              {!isLoading && latestJoke && (
                <div className="rounded-lg shadow-md text-center">
                  <p className="text-lg">{latestJoke}</p>
                </div>
              )}
              {isLoading && (
              <motion.div
                className="absolute top-5 w-6 h-6 bg-white rounded-full"
                animate={{
                  scale: [1, 2, 2, 1, 1],
                  rotate: [0, 0, 180, 180, 0],
                  borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
              />

            )}
          </div>
        </main>
      </div>
    </div>
  );
}