import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/FooterMain";
import { DataProvider } from "@/context/DataContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
}
