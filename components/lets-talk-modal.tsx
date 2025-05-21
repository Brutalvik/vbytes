"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@components/ui/animated-modal";
import styles from "@styles/lets-talk-button.module.css";

export function AnimatedModalDemo() {
  return (
    <div className="py-40  flex items-center justify-center">
      <Modal>
        <ModalTrigger
          className={`bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${styles.button}`}
        >
          <div className={styles.waveOverlay}></div>
          <span className={styles.text}>Let's Talk</span>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Lets
              <span className="mx-4 px-4 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                Talk
              </span>
            </h4>
            <div className="flex justify-center items-center"></div>
            <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <div className="flex  items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  5 connecting flights
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  12 hotels
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  69 visiting spots
                </span>
              </div>
              <div className="flex  items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Good food everyday
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Open Mic
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Paragliding
                </span>
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Cancel
            </button>
            <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
              Book Now
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

