## [2.10.0](https://github.com/lukeashford/aurelius/compare/v2.9.0...v2.10.0) (2026-01-12)

### Features

* **build:** add demo linting and refactor lint scripts ([b71c30c](https://github.com/lukeashford/aurelius/commit/b71c30ce5600f97f099c8df60d8260f7c2f87243))
* **chat-demo:** improve attachment haptics ([b87cada](https://github.com/lukeashford/aurelius/commit/b87cadaa53f3583188beba250647c2785a536ef1))
* **chat-demo:** revise helper text for message actions guidance ([a57bff8](https://github.com/lukeashford/aurelius/commit/a57bff81cf697fcd508eefddb46b412efb54ccdd))
* **chat-input:** update layout for responsiveness and animation effects ([b6493ad](https://github.com/lukeashford/aurelius/commit/b6493adea43c206b0c9265c8b458966bcba3724a))
* **chat-interface:** enhance section with aurelius components and styling adjustments ([c124662](https://github.com/lukeashford/aurelius/commit/c12466205c0174bc4a666844a588c413d8d02897))
* **chat:** add message actions, branching, attachments, and thinking indicator ([b9269cc](https://github.com/lukeashford/aurelius/commit/b9269cc39e272a34ca44c9a7769537b0b2117650))
* **chat:** add production-grade chat interface components ([a16ceb1](https://github.com/lukeashford/aurelius/commit/a16ceb1fb0b9ccd24be221b3d8eefb6cc4cade22)), closes [#chat-demo](https://github.com/lukeashford/aurelius/issues/chat-demo)
* **chat:** implement adaptive spacer for precise viewport fill ([3013a5b](https://github.com/lukeashford/aurelius/commit/3013a5bbc72c34baea5978e568b26a83f32ca120))
* **chat:** improve panel UX with symmetric toggle behavior ([d0f9261](https://github.com/lukeashford/aurelius/commit/d0f92615228c97850e1d48f547119d6e136c42a0))
* **chat:** improve scroll anchoring and thinking indicator variety ([0b84f30](https://github.com/lukeashford/aurelius/commit/0b84f3089e3ecd6a7e77b0d4a3fda6e5a1a64015))
* **styles:** adjust fonts for same size ([e90243d](https://github.com/lukeashford/aurelius/commit/e90243d4cbaa0e72e77f960219b8dfdeacc3b668))
* **styles:** reset default color variables in theme ([7f737bf](https://github.com/lukeashford/aurelius/commit/7f737bfb96f149d357df675f975ad9e16d74fed8))

### Bug Fixes

* add flex-zero utility for proper collapse behavior ([4457564](https://github.com/lukeashford/aurelius/commit/445756443971579644360b00848acbae43ebe326))
* **artifacts:** persist artifacts after streaming ends and fix demo page issues ([f91c40a](https://github.com/lukeashford/aurelius/commit/f91c40ab14738411bfd6db6d99db6e9762a850a1))
* **artifacts:** use stable IDs and improve demo streaming ([98dc23e](https://github.com/lukeashford/aurelius/commit/98dc23e0273a16e946b04b0cf37ebc4b29496027))
* **chat-view:** show actions on all non-streaming messages ([c5e6cb4](https://github.com/lukeashford/aurelius/commit/c5e6cb407453fac6d31de805b917de6010c69c34))
* **chat:** add position relative to content wrapper for reliable offsetTop ([aaf4a53](https://github.com/lukeashford/aurelius/commit/aaf4a53a7c18bc41dedc1ca8bfe0b2a3e4dacf49))
* **chat:** address UI feedback and enforce square corners ([acc8141](https://github.com/lukeashford/aurelius/commit/acc81416aa723b1d58272b45d23ec6fb608cbef8))
* **chat:** calculate spacer based on anchor position ([ad5279c](https://github.com/lukeashford/aurelius/commit/ad5279c97f60601eef056688521f324700cf8a36))
* **chat:** ensure spacer updates before scroll for subsequent messages ([821b66e](https://github.com/lukeashford/aurelius/commit/821b66e06eb6f523c0eb456c5aa0f17b69fa61cc))
* **chat:** improve message actions and edit UX ([4f281ee](https://github.com/lukeashford/aurelius/commit/4f281eed9aa42ad6bcdd57b18e7e2caf8f6bc362))
* **chat:** inject streaming cursor inside markdown content ([cb624a2](https://github.com/lukeashford/aurelius/commit/cb624a20c24edfc7e61e9fbf72aea63a057e663a))
* **chat:** prevent cursor pulsing after Stop by not spreading node isStreaming ([d2d4472](https://github.com/lukeashford/aurelius/commit/d2d44724b12d102cb26ae7043f5cd5f041a4960f))
* **chat:** use offsetTop for stable anchor measurement ([e8f8336](https://github.com/lukeashford/aurelius/commit/e8f8336b2a2375d2d005c2143afb9cd7db6b2c7b))
* **ci:** use lint:core in release workflow to match test workflow ([13f88e5](https://github.com/lukeashford/aurelius/commit/13f88e5807f54590d9c9d5b3d3c8c06bd9df58ad))
* **ci:** use lint:core in release workflow to match test workflow ([#21](https://github.com/lukeashford/aurelius/issues/21)) ([1d097e4](https://github.com/lukeashford/aurelius/commit/1d097e4ccd6a3b6dcec27bc3c4840855c5ccb9b3))
* **e2e:** adjust to new features ([34b048c](https://github.com/lukeashford/aurelius/commit/34b048ca908d8aba548bc71fda24d049b9906cb7))
* resolve linting errors and update snapshots for new features ([954e771](https://github.com/lukeashford/aurelius/commit/954e771c8ab122e309aa1566f9256557f718540b))
* **video-cards:** lint error ([3997d28](https://github.com/lukeashford/aurelius/commit/3997d28e74ee98edb6efffe491dfd7de73a02e55))

## [2.9.0](https://github.com/lukeashford/aurelius/compare/v2.8.0...v2.9.0) (2026-01-10)

### Features

* **docs:** update setup instructions with vite-specific config ([5e1be8b](https://github.com/lukeashford/aurelius/commit/5e1be8b58dccb3f25ecacf3b21b56a600707c2eb))
* **docs:** update setup instructions with vite-specific config ([#19](https://github.com/lukeashford/aurelius/issues/19)) ([ca25924](https://github.com/lukeashford/aurelius/commit/ca2592406ce3a0c8b4bc453bd123b4331be18fb7))

## [2.8.0](https://github.com/lukeashford/aurelius/compare/v2.7.0...v2.8.0) (2026-01-09)

### Features

* **docs:** document VideoCard props in llms.md ([09a2f86](https://github.com/lukeashford/aurelius/commit/09a2f86770d3c0388ecd75eb9b0d5306c28b3df8))
* **video-cards:** add video card section with react-player integration ([82ea1e1](https://github.com/lukeashford/aurelius/commit/82ea1e168db8c0f74a55ba1764a324a78fd47678))

### Bug Fixes

* **cards:** image card bottom pad ([3249f77](https://github.com/lukeashford/aurelius/commit/3249f77693001ca80039a10f1032f8dc81107281))

## [2.7.0](https://github.com/lukeashford/aurelius/compare/v2.6.0...v2.7.0) (2026-01-09)

### Features

* **styles:** add twMerge ([87e23aa](https://github.com/lukeashford/aurelius/commit/87e23aa05393d82655907af314f18be4c827fb4e))
* **styles:** add twMerge ([#17](https://github.com/lukeashford/aurelius/issues/17)) ([1198a99](https://github.com/lukeashford/aurelius/commit/1198a99e341c749dbd2744fdf27213bc85012efd))

## [2.6.0](https://github.com/lukeashford/aurelius/compare/v2.5.0...v2.6.0) (2026-01-07)

### Features

* **ui:** rm ChatHistory styling div ([0829504](https://github.com/lukeashford/aurelius/commit/08295046521be25b549258a63e05c9add96255d6))

### Bug Fixes

* **components:** replace utility functions with class mapping objects ([10d860e](https://github.com/lukeashford/aurelius/commit/10d860edc71c21fa7b564b0964cdb10db6b6f2f3))
* **tests:** update message section snapshot and adjust message styling ([3607976](https://github.com/lukeashford/aurelius/commit/36079761ca45d15bf2e965a24e6b35a2d8058e6e))

## [2.5.0](https://github.com/lukeashford/aurelius/compare/v2.4.0...v2.5.0) (2025-12-25)

### Features

* **docs:** add lint script setup instructions to readme ([eb5a77e](https://github.com/lukeashford/aurelius/commit/eb5a77e11a0e241aa8476f98c63251ffa246ab2d))
* **docs:** add lint script setup instructions to readme ([#15](https://github.com/lukeashford/aurelius/issues/15)) ([5cd7d84](https://github.com/lukeashford/aurelius/commit/5cd7d841543a9464480df79f1a8a8cb69d619bc9))

## [2.4.0](https://github.com/lukeashford/aurelius/compare/v2.3.0...v2.4.0) (2025-12-25)

### Features

* **styles:** update gold color for improved palette consistency ([ee4102b](https://github.com/lukeashford/aurelius/commit/ee4102b36a76241a92efafaa195e34f429ae084e))
* **styles:** update gold color for improved palette consistency ([#14](https://github.com/lukeashford/aurelius/issues/14)) ([c3ae445](https://github.com/lukeashford/aurelius/commit/c3ae445352a19e668abfafdf24e21d4dc43e8e1e))

## [2.3.0](https://github.com/lukeashford/aurelius/compare/v2.2.0...v2.3.0) (2025-12-24)

### Features

* **components:** major component library expansion with 17 new components ([6bed535](https://github.com/lukeashford/aurelius/commit/6bed535a866ef0f4761dc741f8671ce930c02f84))
* **demo:** expand demo coverage for all new components ([4f31f24](https://github.com/lukeashford/aurelius/commit/4f31f24733361bec6f003ea2c4bbd9bf74ed722d))
* **layout:** add Container, Row, Col components and CSS grid system ([bfe460d](https://github.com/lukeashford/aurelius/commit/bfe460da1b9c842183e4351bd64a7e071e9a97d9))
* **layout:** enhance layout system with full Bootstrap parity ([47d4e44](https://github.com/lukeashford/aurelius/commit/47d4e448b95838efd417994e02c51fc8102f4f84))
* **scripts:** add test command to package.json ([c110b3e](https://github.com/lukeashford/aurelius/commit/c110b3e7fb4c61b73bc8a1ebdd40ede066e40f86))
* **styles:** add derived CSS custom props and layout tokens ([c52cab0](https://github.com/lukeashford/aurelius/commit/c52cab0516dc145d6e390ad156190c72b7cc4980))
