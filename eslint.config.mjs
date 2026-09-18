<<<<<<< HEAD
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
=======
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
>>>>>>> a8ed36014a7494559268129c32c01bca01578764

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
<<<<<<< HEAD
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
=======
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
]);

export default eslintConfig;
