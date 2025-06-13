export default function MomentumLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex items-center justify-center gap-4">
      <div className="w-full max-w-screen-2xl mt-5">{children}</div>
    </section>
  );
}
