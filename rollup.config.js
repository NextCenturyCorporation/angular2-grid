export default {
  input: "dist/main.js",
  output: {
    file: "dist/bundles/NgGrid.umd.js",
    sourcemap: false,
    name: "ng.grid",
    format: "umd",
    globals: {
      "@angular/core": "ng.core"
    }
  },
  external: ["@angular/core", "rxjs"]
};
