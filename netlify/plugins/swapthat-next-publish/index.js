/**
 * Netlify UI often sets "Publish directory" to the same path as "Base directory" (e.g. `site`).
 * @netlify/plugin-nextjs then fails: publishDir === package root.
 * This runs in onPreBuild and forces publish to the Next output dir (repo-relative).
 */
module.exports = {
  onPreBuild({ netlifyConfig }) {
    netlifyConfig.build.publish = "site/.next";
  },
};
