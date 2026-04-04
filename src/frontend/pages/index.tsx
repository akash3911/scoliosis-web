import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "components/Head";

// Components
import Nav from "components/Nav";
import { motion } from "framer-motion";
import enterAnim from "@/utils/enterAnim";
import AnimatedBackground from "components/AnimatedBackground";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Head overrideTitle="Scoliotect - Automatically measure Cobb Angles with Machine Learning" />
      <main className="h-[100svh]">
        <section className="relative h-full flex flex-col">
          <Nav />
          <AnimatedBackground />
          <div className="relative z-10 fluid-container px-6 md:px-9 flex-1 flex items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
              <motion.div {...enterAnim()} className="max-w-xl">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
                  Automatic <span className="text-primary">Cobb Angle</span>
                  <br />
                  Measurement
                </h1>
                <p className="mt-4 text-sm md:text-base text-gray-700">
                  Two-stage YOLOv8 pipeline for vertebra detection, landmark
                  extraction, and scoliosis curve measurement from X-rays.
                </p>
                <div className="mt-6">
                  <Link href="/app">
                    <a className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white font-semibold shadow-md transition hover:opacity-90">
                      Open App
                    </a>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                {...enterAnim(0.15)}
                className="relative w-full h-[240px] md:h-[380px] rounded-xl overflow-hidden shadow-lg bg-white/80"
              >
                <Image
                  src="/architecture.png"
                  alt="Scoliotect architecture diagram"
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
