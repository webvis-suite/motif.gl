# How this cylynx-datastudio was _initially_ setup

Install the development environment via `npm`:

```bash
npx @google/dscc-gen viz # project-name=motif-datastudio, buckets gs://lynx-community-viz/cylynx-motif[-dev]
cd motif-datastudio      # generated by above command
npm run start            # fails as of 8 Jan 2021
```

Known package distribution issue here: https://github.com/googledatastudio/tooling/issues/190

Fix issue by editing `cylynx-datastudio/webpack.config.js`:

```js
--- const {getBuildableComponents} = require('@google/dscc-scripts/build/viz/util');

--- const components = getBuildableComponents();
--- const componentIndexToBuild = Number(process.env.WORKING_COMPONENT_INDEX) || 0;
--- const component = components[componentIndexToBuild];

--- console.log(`Building ${component.tsFile || component.jsFile}...`);

--- const cssFilePath = path.resolve(__dirname, 'src', component.cssFile || '');
--- const jsFilePath  = path.resolve(__dirname, 'src', component.jsFile  || '');
+++ const cssFilePath = path.resolve(__dirname, 'src', process.env.npm_package_dsccViz_cssFile || '');
+++ const jsFilePath  = path.resolve(__dirname, 'src', process.env.npm_package_dsccViz_jsFile  || '');
```

`npm run start` should work now and host a server at http://localhost:8080 , which has the
following numbered instructions:

1. Edit `cylynx-datastudio/src/index.json` to declare accepted columns

Also edit `cylynx-datastudio/src/manifest.json` for metadata / company branding

2. `npm run update_message` which uploads to `gs://lynx-community-viz/cylynx-dev`

But this fails as well. As the error message says, in `package.json`, it's expecting `jsonFile`
immediately within `dsccViz` key, so remove the containing `components` key / array and try
again.

In the DataStudio report, add a Community Visualization pointing to the just-uploaded manifest
path `gs://lynx-community-viz/cylynx-dev/`

In DataStudio, go to View mode and copy the entire JSON text in the newly-added visualisation
into `cylynx-datastudio/src/localMessage.js` (this file can/should be .gitignored)

Update `cylynx-datastudio/src/index.js` until the visualisation looks right, then deploy
(automatically to GCS) using:

```bash
npm run build:dev
npm run push:dev
```