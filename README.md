# Deno Package Manager
Deno Package Manager is a small tool that makes it easy to manage module metadata and dependencies for a Deno project in a central place.

DPM introduces a `module.json` file, which functions as an [import map](https://deno.land/manual/linking_to_external_code/import_maps) and is conceptually similar to `package.json` from Node.

Despite its name, DPM does not actually manage packages itself, this is handled by the Deno cache. It merely serves as a convenience for updating the import map and running/managing the project:

- `dpm run`
    - runs the project
- `dpm add sqlite@v0.0.1`
    - adds a dependency on `https://deno.land/sqlite`
- `dpm install`
    - installs the project globally, in case of a binary project