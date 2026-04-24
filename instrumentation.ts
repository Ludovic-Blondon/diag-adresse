export async function register() {
  if (process.env.NODE_ENV !== "production") {
    const { validateArticleRefs } = await import("./lib/validate-articles");
    validateArticleRefs();
  }
}
