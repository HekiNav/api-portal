import type { Metadata } from "next";
import { Karla, Quicksand } from "next/font/google";
import { Toaster } from "react-hot-toast"
import "./globals.css";
import NavBar from "@/components/navbar";
import { getCurrentUser } from "@/lib/auth";
import UserProvider from "./user-provider";
import { getNotifications } from "@/lib/notification";
import AreYouSure from "@/components/areyousure";

const karla = Karla({
	variable: "--font-karla",
	subsets: ["latin"],
});

const shareTechMono = Quicksand({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: "400"
})


export const metadata: Metadata = {
	title: "Hekinav API portal",
	description: "",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getCurrentUser()
	const notifications = user && await getNotifications({ user: user.id })
	return (
		<html lang="en" style={{ height: "100%" }}>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${karla.variable} ${shareTechMono.variable} antialiased bg-white h-full flex flex-col`}>
				<Toaster position="top-right" containerClassName="mt-10"></Toaster>

				<UserProvider user={user} notifs={notifications}>
					<AreYouSure>
						<div className="flex flex-col divide-y-2 divide-blue-800 h-full min-h-screen overflow-y-scroll relative grow relative">
							<div className="h-max flex min-h-full flex-col grow shrink-0 divide-y-2 divide-blue-800">
								<NavBar></NavBar>
								<div className="grow">
									{children}
								</div>
							</div>
							<footer className="p-8 w-full">
								<span className="text-blue-800 font-mono mr-2">Api key portal</span>	© Hekinav {new Date().getFullYear()}
							</footer>
						</div>
					</AreYouSure>
				</UserProvider>

			</body>
		</html>
	);
}
