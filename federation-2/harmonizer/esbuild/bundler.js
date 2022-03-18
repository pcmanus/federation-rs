let denoFsPlugin = {
  name: "fs",
  setup(build) {
    // Intercept require("fs") and replace it with shims
    build.onResolve({ filter: /^fs$/ }, (args) => ({
      path: args.path,
      namespace: "deno-fs",
    }));

    build.onLoad({ filter: /.*/, namespace: "deno-fs" }, () => ({
      contents:
        "module.exports = { existsSync: Deno.ensureFileSync, writeFileSync: Deno.writeTextFile }",
      loader: "js",
    }));
  },
};

// all paths are relative to package.json when run with `npm run build`
require("esbuild")
  .build({
    entryPoints: ["./esbuild/apollo_composition_js.mjs"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "es2020",
    globalName: "composition",
    outfile: "./dist/composition.js",
    format: "iife",
    plugins: [denoFsPlugin],
    define: { Buffer: "buffer_shim" },
    inject: ["./esbuild/buffer_shim.js"],
  })
  .catch(() => process.exit(1));