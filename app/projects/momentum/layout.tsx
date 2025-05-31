export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-screen-2xl">{children}</div>
    </section>
  );
}
