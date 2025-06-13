export default function VelocityLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-screen-2xl mt-10">{children}</div>
    </section>
  );
}
