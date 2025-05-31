
import React from "react";

const Content: React.FC = () => {
  return (
    <div className="lg:w-full text-center lg:text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
        Momentum TaskMaster
      </h1>
      <p className="text-lg text-grey-400 mb-4">
        Dive into a fully functional demo of TaskMaster Pro, my latest task management application.
        Experience its intuitive design and features right here within this interactive iPhone
        mockup.
      </p>
      <ul className="list-disc list-inside text-gray-200 mb-6 space-y-2 text-left mx-auto lg:mx-0 max-w-md">
        <li>Secure user authentication & data privacy.</li>
        <li>Create, manage, and track your tasks seamlessly.</li>
        <li>Integrated calendar view for better planning.</li>
        <li>Switch between light and dark modes for comfort.</li>
        <li>Powered by React, Next.js, Firebase, and Tailwind CSS.</li>
      </ul>
      <p className="text-gray-500 text-sm">
        <strong>Interact with the app on the right!</strong>
      </p>
    </div>
  );
};

export default Content;
