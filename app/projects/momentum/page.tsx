"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { firebaseConfig as importedFirebaseConfig, dynamicAppId } from "@lib/firebase";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/ui-loader/loader";

const MomentumPage = dynamic(() => import("@components/apps/momentum/page"), {
  ssr: false,
  loading: () => <Loader />,
});

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
      <div className="mt-20">
        <MomentumPage clientFirebaseConfig={clientFirebaseConfig} clientAppId={clientAppId} />
      </div>
    </>
  );
}
