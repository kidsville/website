export interface Env {
	// If you set another name in the Wrangler config file for the value for 'binding',
	// replace "DB" with the variable name you defined.
	kidsville_website: D1Database;
}

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/sean") {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.kidsville_website.prepare(
				"SELECT * FROM Users WHERE UserName = ?",
			)
				.bind("Sean")
				.run();
			return Response.json(results);
		}

		return new Response(
			"Call /api/??? to see things about someone",
		);
	},
} satisfies ExportedHandler<Env>;
