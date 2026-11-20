import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Hello World worker", () => {
	it("responds with Hello World! (unit style)", async () => {
		const request = new Request("http://example.com");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it("responds with Hello World! (integration style)", async () => {
		const response = await SELF.fetch("http://example.com");
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	it("reports that BOOSTA_KEY is absent without revealing a value", async () => {
		const ctx = createExecutionContext();
		const response = await worker.fetch(new Request("http://example.com/ready"), {}, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual({ boostaKey: false });
	});

	it("reports that BOOSTA_KEY is configured without revealing the value", async () => {
		const secret = "local-check-value";
		const ctx = createExecutionContext();
		const response = await worker.fetch(
			new Request("http://example.com/ready"),
			{ BOOSTA_KEY: secret },
			ctx,
		);
		await waitOnExecutionContext(ctx);
		const body = await response.text();
		expect(body).not.toContain(secret);
		expect(JSON.parse(body)).toEqual({ boostaKey: true });
	});
});
