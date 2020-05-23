/** A Deno project's metadata. */
export interface Module {
    /** The project's name. */
    name: string;
    /** The project's version. */
    version: string;
    /** The project's description. */
    description: string;
    /** The project's author */
    author: string;
    /** A path to the main source file. */
    main: string;
    /** The project's dependencies, serving as an import map. */
    imports: { [alias: string]: string; };
}