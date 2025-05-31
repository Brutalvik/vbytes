"use client"

import React from 'react'
import "./iphone.css"
import TaskMasterProApp from '@components/apps/momentum/TaskMasterProApp';

interface IphoneProps {
  clientFirebaseConfig: any;
  clientAppId: string;
}

const Iphone: React.FC<IphoneProps> = ({ clientFirebaseConfig, clientAppId }) => {
  return (
    <div className="lg:w-full flex justify-center items-center">
      <div className="iphone-frame">
        <div className="iphone-screen-container">
          <div className="iphone-notch"></div>
          <div className="iphone-app-content-wrapper">
            {clientFirebaseConfig && clientAppId ? (
              <TaskMasterProApp
                firebaseConfig={clientFirebaseConfig}
                appId={clientAppId}
                // initialAuthToken={clientInitialAuthToken} //Pass here
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading App Config...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iphone