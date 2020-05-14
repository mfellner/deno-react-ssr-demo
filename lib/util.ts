/**
 * Get an integer value from an environment variable.
 *
 * @param name Name of the environment variable.
 * @param fallback Default value in case the environment variable is not defined.
 */
export function getIntFromEnv(name: string, fallback: number): number {
  return parseInt(Deno.env.get(name) || '') || Math.floor(fallback);
}
