import Navbar from "@/components/custom/Navbar";
import Footer from '@/components/custom/Footer'

interface RootLayoutProps {
    children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}