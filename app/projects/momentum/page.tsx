"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import Iphone from "@components/apps/momentum/iphone/iphone";
import Content from "@components/apps/momentum/content/content";
import { firebaseConfig as importedFirebaseConfig, dynamicAppId } from "@lib/firebase";

export default function Momentum() {
  // State to hold config to ensure it's client-side when passed to component
  const [clientFirebaseConfig, setClientFirebaseConfig] = useState(null);
  const [clientAppId, setClientAppId] = useState("");
  // const [clientInitialAuthToken, setClientInitialAuthToken] = useState(null); // If you were to use this

  useEffect(() => {
    setClientFirebaseConfig(importedFirebaseConfig as any);
    setClientAppId(dynamicAppId as any);

    // const token = getShowcaseAuthToken(); // Placeholder for your logic
    // setClientInitialAuthToken(token);
  }, []);

  return (
    <>
      <Head>
        <title>Momentum | Task Master</title>
      </Head>
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-12">
        <div className="w-full lg:w-1/2">
          <Content />
        </div>
        <div className="w-full lg:w-1/2">
          <Iphone clientFirebaseConfig={clientFirebaseConfig} clientAppId={clientAppId} />
        </div>
      </div>
    </>
  );
}
