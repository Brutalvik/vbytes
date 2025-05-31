"use client"
import React from 'react'
import Content from "@components/apps/momentum/content/content"
import Iphone from "@components/apps/momentum/iphone/iphone"

export interface MomentumPageProps {
  clientFirebaseConfig: any;
   clientAppId: string;
}

const MomentumPage: React.FC<MomentumPageProps> = ({ clientFirebaseConfig, clientAppId }) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 ">
      <div className="w-full lg:w-1/2">
        <Content />
      </div>
      <div className="w-full lg:w-1/2">
        <Iphone clientFirebaseConfig={clientFirebaseConfig} clientAppId={clientAppId} />
      </div>
    </div>
  );
};

export default MomentumPage;