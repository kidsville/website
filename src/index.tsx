import { Hono } from "hono";

type Bindings = {
  kidsville_website: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

async function hashPassword(salt: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
  storedPassword: string,
  plaintext: string,
): Promise<boolean> {
  const [salt, storedHash] = storedPassword.split(":");
  if (!salt || !storedHash) return false;
  const computedHash = await hashPassword(salt, plaintext);
  return computedHash === storedHash;
}

const Layout = ({ children }: { children: any }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Kidsville Login</title>
      <script src="https://unpkg.com/htmx.org@2.0.8"></script>
      <script src="https://cdn.tailwindcss.com/3.4.17"></script>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center">
      {children}
    </body>
  </html>
);

const LoginForm = () => (
  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
    <form
      hx-post="/login"
      hx-target="#result"
      hx-swap="innerHTML"
      class="space-y-4"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Log In
      </button>
    </form>
    <div id="result" class="mt-4"></div>
  </div>
);

// Serve the login page
app.get("/", (c) => {
  return c.html(
    <Layout>
      <LoginForm />
    </Layout>
  );
});

// Handle login via HTMX
app.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const username = body["username"] as string;
  const password = body["password"] as string;

  if (!username || !password) {
    return c.html(
      <p class="text-red-600 text-sm text-center">Please fill in both fields.</p>
    );
  }

  const user = await c.env.kidsville_website
    .prepare("SELECT * FROM Users WHERE UserName = ?")
    .bind(username)
    .first();

  if (user && (await verifyPassword(user.Password as string, password))) {
    return c.html(
      <p class="text-green-600 text-sm text-center font-medium">
        Welcome back, {user.UserName as string}!
      </p>
    );
  }

  return c.html(
    <p class="text-red-600 text-sm text-center">Invalid username or password.</p>
  );
});

export default app;
