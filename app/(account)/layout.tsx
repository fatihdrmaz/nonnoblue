export default function AccountLayout({ children }: { children: React.ReactNode }) {
  // TODO: auth guard eklenecek
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
