import Robot from "@components/ui/robot";

export default function Home() {
  return (
    <section className="relative w-full h-full overflow-hidden">
      {/* 👇 Fullscreen Robot Background */}
      <div className="fixed inset-0 z-0 w-screen h-screen">
        <div className="w-full h-full scale-125 translate-x-10 md:translate-x-32">
          <Robot />
        </div>
      </div>

      {/* 👇 Foreground Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full h-full px-6 md:px-16">
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
            Crafting Code. Empowering Ideas.
          </h1>
          <p className="text-lg md:text-xl text-white/80 drop-shadow">
            Deploying Scalable Systems · Cloud Solutions · APIs · Serverless
            Apps
          </p>
          <p className="text-lg md:text-xl text-white/80 drop-shadow">
            Build with precision. Launch with confidence.
          </p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition">
            Let’s Connect
          </button>
        </div>
      </div>
    </section>
  );
}
