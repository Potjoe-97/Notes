# Project Structure
As the application grew in complexity, our build system was growing even more difficult to maintain and was spread across multiple repositories. As such we have decided to use a mono-repo approach, and to do so we chose to have NX manage our mono-repo.

## Project structure

The mono-repo is mainly structured in:

*   `apps`, representing runnable entry-points such as the `desktop`, the `server` but also additional tooling.
    *   `client`, representing the front-end that is used both by the server and the desktop application.
    *   `server`, representing the Node.js / server version of the application.
    *   `desktop`, representing the Electron-based desktop application.
*   `packages`, containing dependencies used by one or more `apps`.
    *   `commons`, containing shared code for all the apps.

## Working with NX

### Running tasks via the CLI

For example to run the server instance:

```
pnpm exec nx run server:serve
```

NX has built-in cache support which should make development much faster. Sometimes, it can get in the way; to skip the cache simply append `--skip-nx-cache` to the command you are running.

### Running tasks using Visual Studio Code

If you are using Visual Studio Code as your development tool for Trilium, consider using the NX Console. It allows running tasks/targets much easier via the dedicated tab. Right-click a target in the list for more options, such as bypassing the cache.

## Important tasks

Each application has a number of tasks (called _targets_ by NX). Here's a non-exhaustive list of the tasks that are useful during development.

To run any of the task use `pnpm exec nx run project:task`, or use the Visual Studio Code integration as described above.

*   `client`:
    *   The client is not meant to be run by itself, despite being described as an app. See the documentation on the server instead.
*   `server`:
    *   To run the server in development mode, run `client:serve` (which will only serve the public assets), followed by `server:serve` (which will proxy the assets of the client as well). The dev port remains the same as always, `8080`.
    *   To run the server in production mode (with its own copy of the assets), run `server:start-prod`.
    *   To build the server for Docker, run `docker-build` which will automatically build and tag the image if Docker is installed locally.
    *   Similarly, run `docker-start` to build and run the Docker image.
*   `desktop`:
    *   To run the desktop, run `desktop:serve`.
    *   Unlike the server, this one does not require the client since it will automatically get a production copy of it. The only downside is that modifications to the code will only take effect after restarting the task.

## Building packages

Generally, the building process of a project generates a `dist` folder containing everything needed for production. To trigger a build run `pnpm nx build project` where `project` is the name of a project from either `apps` or `packages`.

## Managing dependencies across the mono-repo

We are using [pnpm workspaces](https://pnpm.io/workspaces) to manage the project structure, further augmented by NX which is described in a different section.

The workspace configuration is in `pnpm-workspace.yaml` at project level but it generally should not be modified.