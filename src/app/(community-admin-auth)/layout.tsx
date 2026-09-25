export default function CommunityAdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-[#FAFBFF]">
      {children}
    </div>
  );
}
