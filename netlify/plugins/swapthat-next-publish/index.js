/**
 * Netlify UI may set Publish = Base (e.g. both `site`), which breaks @netlify/plugin-nextjs.
 * Build copies `.next` to the repo root (see `npm run netlify-build`); publish must be `.next`
 * at repo root — never the same path as `base` (`site`).
 * Mutating onPreBuild applies before the build step so deploy config matches the final layout.
 */
module.exports = {
  onPreBuild({ netlifyConfig }) {
    netlifyConfig.build.publish = ".next";
  },
};
