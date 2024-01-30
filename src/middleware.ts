import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  if (
    context.url.pathname === "/" &&
    context.preferredLocale &&
    context.preferredLocale !== "pl"
  ) {
    return context.redirect(`/${context.preferredLocale}`);
  }

  return next();
});
