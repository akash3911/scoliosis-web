import Nav from "components/Nav";
import React from "react";
import { motion } from "framer-motion";

import enterAnim from "@/utils/enterAnim";


import Head from "components/Head";
import useRefInView from "@/hooks/useRefInView";
import Link from "next/link";

const AboutPage = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Head pageTitle="About" pagePath="about" />
      <Nav />
      <main className="flex-grow">
        <div className="w-full max-w-xl mx-auto px-9">
          
          <motion.h1
            {...enterAnim(0.1)}
            className="text-6xl font-extrabold mb-6"
          >
            About
          </motion.h1>
          <motion.h2
            {...enterAnim(0.15)}
            className="text-2xl font-bold text-primary mb-3"
          >
            Scoliosis Curve detection
          </motion.h2>
          <motion.p {...enterAnim(0.2)}>
            <b>Scoliotect</b> is an automatic cobb angle measurement tool.
          </motion.p>
          <motion.p {...enterAnim(0.3)} className="mt-1.5">
            This web application follows a two-stage pipeline built around
            YOLOv8 pose. The model detects vertebrae as one class with five
            keypoints per object and uses the four edge keypoints for
            downstream processing.
          </motion.p>
          <motion.p {...enterAnim(0.35)} className="mt-3 text-gray-700">
            During inference, a trained .pt file returns vertebra bounding
            boxes and keypoints, then the Cobb-angle stage converts keypoints
            into a landmark vector and computes curve classification and angle
            measurements. Reusable training and inference utilities are shared
            in the core pipeline, while the notebooks act as orchestration
            layers.
          </motion.p>

          <h2 className="mt-16 mb-6 text-2xl text-center text-gray-700 font-semibold">
            Team Members
          </h2>

          <div className="text-gray-700 space-y-2">
            <p>22BCE8850 - RASABATTULA MUKESH VENKAT SAI</p>
            <p>22BCE20488 - AKASH JONNALAGADDA</p>
            <p>22BCE9740 - CHAGARLAMUDI HARSHITH</p>
            <p className="pt-2 font-medium">Guide: PUTTA DURGA</p>
            <p className="font-medium">SDP ID: 20250858</p>
          </div>

          <h2 className="mt-16 mb-6 text-2xl text-center text-gray-700 font-semibold">
            References
          </h2>
          <Link href="http://www.digitalimaginggroup.ca/members/Shuo/MICCAIAutomatic.pdf">
            <a id="shuo-li-ref" target="_blank">
              <p className="hover:shadow-md transition text-gray-700 text-sm bg-gray-100 rounded-xl px-5 py-3">
                Wu, H., Bailey, Chris
              </p>
            </a>
          </Link>
        </div>
      </main>
      
    </div>
  );
};

export default AboutPage;