"use server"

import Card from "@/components/card";
import { getServices } from "@/lib/public";

export default async function Home() {
	const services = await getServices()
	return (
		<div className="m-4">
			<h1 className="font-mono text-5xl text-blue-800">
				Hekinav API Portal
			</h1>
			<p>
				Portal for generating and authenticating API Tokens for Hekinav APIs.
			</p>
			<h2 className="font-mono text-2xl text-blue-800 mt-20">
				APIs
			</h2>
			<div className="api-carousel flex overflow-x-scroll gap-4">
				{...(services || []).map((s, i) => (
					<Card key={i} small className="w-50!" cardTitle={s.name}>
						<div className="px-2">
							{s.description}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
