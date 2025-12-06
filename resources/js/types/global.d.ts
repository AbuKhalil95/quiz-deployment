import type { Config, RouteParam } from "ziggy-js";

// Import RouteList from the ziggy-js module augmentation
type RouteList = import("ziggy-js").RouteList;

type RouteName = keyof RouteList;

// Extract parameter names and build the params object
type RouteParams<T extends RouteName> = RouteList[T] extends readonly [
    ...infer Params
]
    ? {
          [K in Params[number] as K extends { name: infer N }
              ? N extends string
                  ? N
                  : never
              : never]: string | number;
      }
    : never;

declare global {
    /**
     * Ziggy route helper with TypeScript support.
     *
     * LIMITATIONS:
     * - Only handles URL PATH parameters (e.g., /users/{id})
     * - Does NOT handle query parameters, headers, or request body
     *
     * Usage:
     *   route("admin.users.create")  // No params
     *   route("admin.users.destroy", user.id)  // Single param (direct value)
     *   route("admin.users.destroy", { id: user.id })  // Single param (object)
     *   route("student.attempts.take.single", { attempt: 1, questionIndex: 0 })  // Multiple params
     */
    function route<T extends RouteName>(
        name: T,
        params?: RouteParams<T> | RouteParam | string | number,
        absolute?: boolean,
        config?: Config
    ): string;
}

export {};
