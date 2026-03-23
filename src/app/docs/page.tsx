"use server"

import Link from "next/link"

export default async function ApiDocsPage() {
    return (
        <div className="p-4">
            <h1 className="text-5xl text-blue-800 font-mono">Portal API</h1>
            <h2 className="text-2xl mt-2">Endpoints</h2>
            <h3 className="text-lg mt-2 text-blue-800 underline"><Link href={`/api/auth?sid=<service_id>&token=<hekinav_api_token>`}>/auth?sid=&lt;service&gt;&token=&lt;token&gt;</Link></h3>
            <p>
                Authenticates API Tokens. Use with your external api to check the validity of the user&apos;s API token.
            </p>

            <h4 className="mt-2 font-bold">Parameters</h4>
            <table className="border-spacing-1 border-separate">
                <tr><td>sid</td> <td>Unique id of the service to authenticate for.</td></tr>
                <tr><td>token</td> <td>Token to authenticate. e.g. &quot;hk.eyXXXXXXXX-XXXXXXXXXXXXXXXX&quot;</td></tr>
            </table>

            <h4 className="mt-2 font-bold">Return type</h4>
            <code>
                &#123;
                <br />
                &emsp;&emsp;&emsp;&emsp;success: <span className="text-blue-600">boolean</span>
                <br />
                &emsp;&emsp;&emsp;&emsp;message: <span className="text-blue-800">string</span>
                <br />
                &#125;
            </code>
        </div>
    )
}