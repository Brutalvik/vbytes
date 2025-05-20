import Robot from "@components/ui/robot";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-left gap-4 py-8 md:py-10">
      <div className="w-100">
        <Robot />
      </div>
    </section>
  );
}
