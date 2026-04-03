import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Head from "components/Head";

// Components
import Nav from "components/Nav";
import FixedWindow from "../components/MainAppWindow/MainAppWindow";

import Tippy from "@tippyjs/react";

// Icons
import { FiArrowRight as ArrowIcon } from "react-icons/fi";
import ExampleImageButton from "../components/ExampleImageButton";
import { AiFillPlayCircle as PlayIcon } from "react-icons/ai";
import { followCursor } from "tippy.js";
import { motion } from "framer-motion";
import enterAnim from "@/utils/enterAnim";
import useRefInView from "@/hooks/useRefInView";
import isHover from "@/utils/isHover";
import useHasMounted from "@/hooks/useHasMounted";
import LoadingIcon from "components/LoadingIcon";
import AnimatedBackground from "components/AnimatedBackground";

const Home: NextPage = () => {
  const [isShowing, setShowing] = useState<boolean>(false);

  const hasMounted = useHasMounted();
  const [videoIsRendered, setVideoIsRendered] = useState<boolean>(false);

  const [ref1, inView1] = useRefInView();
  const [ref2, inView2] = useRefInView();
  const [ref3, inView3] = useRefInView();
  const [ref4, inView4] = useRefInView();
  const [ref5, inView5] = useRefInView();

  return (
    <div className="flex flex-col min-h-screen">
      <Head overrideTitle="Scoliotect - Automatically measure Cobb Angles with Machine Learning" />
      <main className="flex-grow h-full">
        <header className="relative min-h-screen min-h-[100svh] flex flex-col">
          <Nav />
          <AnimatedBackground />
          <div className="relative fluid-container px-9 flex flex-col flex-1 justify-center">
            <motion.h1
              {...enterAnim()}
              className="text-center text-3xl font-extrabold pt-2 pb-10 md:py-10"
            >
              Automatic{" "}
              <Tippy
                followCursor={true}
                plugins={[followCursor]}
                animation="scale-extreme"
                content="The standard measurement for scoliosis severity"
              >
                <span className="text-primary">Cobb Angle</span>
              </Tippy>
              <br />
              Measurement
            </motion.h1>
            <motion.div
              {...enterAnim(0.1)}
              className="h-48 max-w-sm w-full mx-auto px-7 flex flex-col items-center"
            >
              <Link href="/app">
                <a className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white font-semibold shadow-md transition hover:opacity-90">
                  Open App
                </a>
              </Link>
            </motion.div>
          </div>
        </header>
        <section className="fluid-container px-9 py-10 overflow-hidden">

          <div className="flex flex-col gap-y-8">
            <motion.h1
              ref={ref3}
              {...enterAnim(0, inView3)}
              className="font-black text-center text-3xl text-gray-800"
            >
              Our Architecture
            </motion.h1>
            <div className="grid grid-cols-2 gap-x-10">
              <motion.div {...enterAnim(0.2, inView3)} className="max-w-xs">
                <h2 className="font-bold text-2xl text-gray-800 mb-2">
                  Two-stage YOLOv8 pipeline
                </h2>
                <p className="text-gray-600">
                  The architecture is a two-stage pipeline built around
                  YOLOv8 pose. First, the dataset defines vertebra instances as
                  one class with five keypoints per object, and training keeps
                  the four edge keypoints needed downstream. Then inference
                  takes a trained .pt model, detects vertebrae on spine x-rays,
                  and returns bounding boxes plus keypoints. The second stage
                  converts predicted keypoints into a landmark vector and runs
                  Cobb-angle logic to classify and measure the spinal curve.
                </p>
              </motion.div>
            </div>

          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Home;
