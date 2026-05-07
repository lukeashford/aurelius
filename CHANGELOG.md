## [4.11.0](https://github.com/lukeashford/aurelius/compare/v4.10.2...v4.11.0) (2026-05-07)

### Features

* **chat:** add BusyOverlay, ChatInputNotice info variant, ChatInterface loading props ([f1e296f](https://github.com/lukeashford/aurelius/commit/f1e296fd64c3493e384ba99faed211278d92bb07))
* **ChatInterface:** inputDisabled prop forwards to ChatInput ([c602305](https://github.com/lukeashford/aurelius/commit/c60230547977edb1e5c3e86a9dbf42c683b651ec))
* **HistoryPanel:** cross-fade title on change so auto-rename gets noticed ([5d66c54](https://github.com/lukeashford/aurelius/commit/5d66c542487af860a9082caa7a46e0a3e4ee148b))

## [4.10.2](https://github.com/lukeashford/aurelius/compare/v4.10.1...v4.10.2) (2026-05-06)

### Bug Fixes

* **deliverable:** reset html/body to white in [@media](https://github.com/media) print ([7e8d6da](https://github.com/lukeashford/aurelius/commit/7e8d6daf9ea60eea28060fb5bb8068218144c914))

## [4.10.1](https://github.com/lukeashford/aurelius/compare/v4.10.0...v4.10.1) (2026-05-06)

### Bug Fixes

* **button:** pulse dot inherits text color so it stays visible on every variant ([4ca2379](https://github.com/lukeashford/aurelius/commit/4ca2379f9d93771cd8556f13ed71c99af0c62bf9))

## [4.10.0](https://github.com/lukeashford/aurelius/compare/v4.9.0...v4.10.0) (2026-05-05)

### Features

* **deliverable:** add document-level theme preset ([362fc90](https://github.com/lukeashford/aurelius/commit/362fc900a18d7e84ad6731dfa70fd79f10459b6d))
* **deliverable:** aspect-ratio + spotlight variants, paper-friendly print polish ([e31ea28](https://github.com/lukeashford/aurelius/commit/e31ea2804330c128ef20017c41dd579bafc7bafc))
* **deliverable:** per-theme typography + add `playful` theme ([4ee3422](https://github.com/lukeashford/aurelius/commit/4ee3422d9312ebefdedcb532d6244435c01982c4))
* **demo:** surface theme typefaces and a live theme selector ([f3573df](https://github.com/lukeashford/aurelius/commit/f3573df2085d72ec9e04358de7594703a6dd62ac))

## [4.9.0](https://github.com/lukeashford/aurelius/compare/v4.8.0...v4.9.0) (2026-05-04)

### Features

* **chat:** expose openArtifact handle for external artifact control ([9f2b56b](https://github.com/lukeashford/aurelius/commit/9f2b56b3d9d2c239ebb89e7fdbf2a35e38835ecc))
* **chat:** expose openArtifact handle for external artifact control ([#59](https://github.com/lukeashford/aurelius/issues/59)) ([d4fb061](https://github.com/lukeashford/aurelius/commit/d4fb06135822ccd87a077941b68821b2e5b4ff06))

## [4.8.0](https://github.com/lukeashford/aurelius/compare/v4.7.0...v4.8.0) (2026-05-04)

### Features

* **demo:** add combobox, file chip, and mention chip sections with tests ([4964970](https://github.com/lukeashford/aurelius/commit/496497079c883a21fbc4a66dc0caae1299f8a65b))

## [4.7.0](https://github.com/lukeashford/aurelius/compare/v4.6.0...v4.7.0) (2026-05-04)

### Features

* **artifact:** add DELIVERABLE card with multi-section deck support ([675cc1c](https://github.com/lukeashford/aurelius/commit/675cc1c474a20175b4706d7b437f1e1488fd7225))
* **artifact:** render DELIVERABLE artifacts via a dedicated card ([517241b](https://github.com/lukeashford/aurelius/commit/517241bf72d7658a9dbe77c497a377a4a66cb3b1))
* **chat:** add {activate} option to addNodeToTree ([d056deb](https://github.com/lukeashford/aurelius/commit/d056deb72db1b311c859470c72c41a49da563371))
* **ui:** add Lightbox and ArtifactLightboxBody components ([95b0d83](https://github.com/lukeashford/aurelius/commit/95b0d8375ba7195fa92b637ed94e947efc5b84af))

### Bug Fixes

* **chat:** drive the streaming cursor from the per-node flag, never the global ([b7e0921](https://github.com/lukeashford/aurelius/commit/b7e09210f3fe5e9834da96306ae7a9009b92fbe9))
* **chat:** render artifact modal through ArtifactCard ([14cdaef](https://github.com/lukeashford/aurelius/commit/14cdaefdbf3320ee8e2873a51b0b93132b0ac148))
* **chat:** setActiveLeaf is a no-op when leafId is not in the tree ([d1d0dd5](https://github.com/lukeashford/aurelius/commit/d1d0dd514e18737a847a96332962b21793655290))

## [4.6.0](https://github.com/lukeashford/aurelius/compare/v4.5.0...v4.6.0) (2026-05-02)

### Features

* **deliverables:** add renderer, routes, and PDF generation tool ([9c29627](https://github.com/lukeashford/aurelius/commit/9c2962739bc8dbcaf9cdb8bc1edf24faf8271c2b))
* **deliverables:** add renderer, routes, and PDF generation tool ([#56](https://github.com/lukeashford/aurelius/issues/56)) ([7f32a89](https://github.com/lukeashford/aurelius/commit/7f32a890893f948a30b379893b6ac3fb95913789))

## [4.5.0](https://github.com/lukeashford/aurelius/compare/v4.4.0...v4.5.0) (2026-05-02)

### Features

* **chat:** add onJumpHere prop and navigation anchors for messages ([3766cda](https://github.com/lukeashford/aurelius/commit/3766cdab67f8cc2ce44ecbef3c53fe4bb880dac4))
* **chat:** add onJumpHere prop and navigation anchors for messages ([#55](https://github.com/lukeashford/aurelius/issues/55)) ([af33c16](https://github.com/lukeashford/aurelius/commit/af33c16fd535bcf8236bb5821aee3877e915e69b))

## [4.4.0](https://github.com/lukeashford/aurelius/compare/v4.3.0...v4.4.0) (2026-05-02)

### Features

* **filechip:** add tooltips for status and lifecycle feedback ([46fb9ca](https://github.com/lukeashford/aurelius/commit/46fb9caac5dfa0bd73532913f00232394248d4c1))
* **filechip:** add tooltips for status and lifecycle feedback ([#54](https://github.com/lukeashford/aurelius/issues/54)) ([a281e36](https://github.com/lukeashford/aurelius/commit/a281e3692ce96aaf39dd8925ec063c18a9095993))

## [4.3.0](https://github.com/lukeashford/aurelius/compare/v4.2.0...v4.3.0) (2026-05-01)

### Features

* **chat:** enable attachment lifecycle tracking and modal links ([14a2fd1](https://github.com/lukeashford/aurelius/commit/14a2fd13d27bafe0d57191618a50f46fb82370c1))
* **chat:** enable attachment lifecycle tracking and modal links ([#53](https://github.com/lukeashford/aurelius/issues/53)) ([290b162](https://github.com/lukeashford/aurelius/commit/290b1629c10ff86862740b6b378c271f105444ed))

## [4.2.0](https://github.com/lukeashford/aurelius/compare/v4.1.0...v4.2.0) (2026-04-29)

### Features

* **markdown:** improve content sanitization and SSR compatibility ([e04ba58](https://github.com/lukeashford/aurelius/commit/e04ba5845d7dec633b0130a2431e98e154a04958))
* **markdown:** improve content sanitization and SSR compatibility ([#52](https://github.com/lukeashford/aurelius/issues/52)) ([9dd6574](https://github.com/lukeashford/aurelius/commit/9dd6574575cbbb8d7bbc8e426ffb1979cb2429fd))

## [4.1.0](https://github.com/lukeashford/aurelius/compare/v4.0.0...v4.1.0) (2026-04-29)

### Features

* **chat:** add tree-based navigation and greyed-future timeline ([ddde0a6](https://github.com/lukeashford/aurelius/commit/ddde0a68cf27cffae8ec8a52039a8b85e9a5bb0f))
* **chat:** add tree-based navigation and greyed-future timeline ([#51](https://github.com/lukeashford/aurelius/issues/51)) ([256af9c](https://github.com/lukeashford/aurelius/commit/256af9c9c2ca3aa19e6e08030b9cede02b6bc17b))

## [4.0.0](https://github.com/lukeashford/aurelius/compare/v3.9.0...v4.0.0) (2026-04-28)

### ⚠ BREAKING CHANGES

* trigger release for previous breaking refactors

### Features

* **release:** add manual workflow_dispatch trigger and update dependencies ([eee3cc6](https://github.com/lukeashford/aurelius/commit/eee3cc6fd136256f1a8d35e7de3854cc9bcac784))
* trigger release for previous breaking refactors ([2802166](https://github.com/lukeashford/aurelius/commit/280216679b98942518af1558f026289b8823b2b6))

## [3.9.0](https://github.com/lukeashford/aurelius/compare/v3.8.1...v3.9.0) (2026-04-22)

### Features

* **chat:** add onAttachmentRemove prop to ChatInput and ChatInterface ([cc7b1c8](https://github.com/lukeashford/aurelius/commit/cc7b1c8bda9d04f0d96edbdb84020abdcfbf279d))
* **chat:** add onAttachmentRemove prop to ChatInput and ChatInterface ([#48](https://github.com/lukeashford/aurelius/issues/48)) ([f71cbb0](https://github.com/lukeashford/aurelius/commit/f71cbb0e0d87adc4b68d34e248ae6f832404e900))
* **chat:** disable send button during file uploads ([b80c1d9](https://github.com/lukeashford/aurelius/commit/b80c1d95f21428819e9b3c7f9a240cbf755ec91c))

## [3.8.1](https://github.com/lukeashford/aurelius/compare/v3.8.0...v3.8.1) (2026-04-20)

### Bug Fixes

* **chat:** replace ChatMessage with MessageNode in chat components ([6175a2c](https://github.com/lukeashford/aurelius/commit/6175a2c61a61c596a77fa53ba2925bc4a227429b))
* **chat:** replace ChatMessage with MessageNode in chat components ([#47](https://github.com/lukeashford/aurelius/issues/47)) ([eca95ef](https://github.com/lukeashford/aurelius/commit/eca95ef9c95d20230555a1dfa23335db5b643393))

## [3.8.0](https://github.com/lukeashford/aurelius/compare/v3.7.0...v3.8.0) (2026-04-19)

### Features

* **message:** support custom React nodes in message content ([e563495](https://github.com/lukeashford/aurelius/commit/e5634958a9cbece9120975e362eafa2ed550ab54))
* **message:** support custom React nodes in message content ([#45](https://github.com/lukeashford/aurelius/issues/45)) ([00a9ad3](https://github.com/lukeashford/aurelius/commit/00a9ad3b21d76ada6025e2ca193e2af86acc9ad7))

## [3.7.0](https://github.com/lukeashford/aurelius/compare/v3.6.0...v3.7.0) (2026-04-18)

### Features

* **chat:** add initialInputValue prop to ChatInput and ChatInterface ([7b24977](https://github.com/lukeashford/aurelius/commit/7b249773bec459c1830774f7200ec7948f9ccc22))
* **chat:** always display subtasks and simplify task counting logic ([1ba32ab](https://github.com/lukeashford/aurelius/commit/1ba32ab72b08bfd90937f6054d809dbb72d710c4))

## [3.6.0](https://github.com/lukeashford/aurelius/compare/v3.5.0...v3.6.0) (2026-04-17)

### Features

* **chat:** add autoFocus prop to ChatInput and ChatInterface ([10e4c69](https://github.com/lukeashford/aurelius/commit/10e4c694575867223cb675c7dcf28e1062c2e6cd))
* **chat:** group history by date, project filter, and rename titles ([fcfcf07](https://github.com/lukeashford/aurelius/commit/fcfcf07abeafb0bb2aef4887416ee7e6573c9541))
* **chat:** improve HistoryPanel layout and styling adjustments ([7ead0a0](https://github.com/lukeashford/aurelius/commit/7ead0a03dc7d6eada30bac9e6bb64751f9406549))

## [3.5.0](https://github.com/lukeashford/aurelius/compare/v3.4.0...v3.5.0) (2026-04-17)

### Features

* **chat:** add initialTopPercent prop to ToolPanelContainer and update resizing config ([1b9f53a](https://github.com/lukeashford/aurelius/commit/1b9f53a7ec4e5b8da417235cda364a37f6a678a5))
* **chat:** add support for input notices and onInputChange callback ([4f64500](https://github.com/lukeashford/aurelius/commit/4f6450040ac37646ce3e88e61526fd0fe5563e15))
* **chat:** add warning and error notices to input section tests ([307419d](https://github.com/lukeashford/aurelius/commit/307419d270d0c0fb47522e50891b18528d133e2d))

## [3.4.0](https://github.com/lukeashford/aurelius/compare/v3.3.0...v3.4.0) (2026-04-13)

### Features

* **chat:** add runBrandAnalysisWorkflow with looping support ([f42f08b](https://github.com/lukeashford/aurelius/commit/f42f08b53ebf36ab5e79f7c67295a7062b9d5438))
* **chat:** show pending feedback on Stop All Tasks while async ([14eba21](https://github.com/lukeashford/aurelius/commit/14eba2127483246489a897c2839426b5ab132b49))
* **demo:** add 1s delay to handleStopAllTasks to demo pending state ([98dc656](https://github.com/lukeashford/aurelius/commit/98dc656c4c919c109ca15b280613cb9659e0e561))

## [3.3.0](https://github.com/lukeashford/aurelius/compare/v3.2.1...v3.3.0) (2026-04-08)

### Features

* **chat:** add onStopAllTasks callback to TodosList and ChatInterface ([2d010a0](https://github.com/lukeashford/aurelius/commit/2d010a0e3a5da0c2879d206356eca28a7ac4b93d))
* **demo:** wire onStopAllTasks into ChatDemo ([76d4b83](https://github.com/lukeashford/aurelius/commit/76d4b833748088cb8921b32b198f01328631ce6d))

## [3.2.1](https://github.com/lukeashford/aurelius/compare/v3.2.0...v3.2.1) (2026-04-06)

### Bug Fixes

* **chat:** update z-index for resize handles to prevent overlap issues ([7da42d2](https://github.com/lukeashford/aurelius/commit/7da42d264831cee22035395007d09cc45fbd250b))

## [3.2.0](https://github.com/lukeashford/aurelius/compare/v3.1.0...v3.2.0) (2026-04-02)

### Features

* **chat:** make history panel open by default ([d998077](https://github.com/lukeashford/aurelius/commit/d998077fcac3ed14c1f6124149ea2ffe692db329))
* **chat:** remove deprecated ConversationSidebar component ([207750a](https://github.com/lukeashford/aurelius/commit/207750a878dc6a10f95b95ed5f2e131298aa1921))

### Bug Fixes

* remove redundant ConversationSidebar, use History tool panel for chat history ([7c876f9](https://github.com/lukeashford/aurelius/commit/7c876f9425f279766ef0bccca1e58b5e4c8b37fc))

## [3.1.0](https://github.com/lukeashford/aurelius/compare/v3.0.0...v3.1.0) (2026-03-27)

### Features

* add dual sidebar tool system with external tool support ([06e2ddf](https://github.com/lukeashford/aurelius/commit/06e2ddfd9fdb2e7feef15853ad29a52366b8f1dc))

### Bug Fixes

* update snapshots and pin playwright for dual sidebar layout ([a0ea88e](https://github.com/lukeashford/aurelius/commit/a0ea88e4bf68260486bc2540845419b3ac98ea2d))

## [3.0.0](https://github.com/lukeashford/aurelius/compare/v2.21.0...v3.0.0) (2026-03-25)

### ⚠ BREAKING CHANGES

* `artifacts` prop removed from ArtifactsPanel and
ChatInterface. `useArtifacts` hook removed. Use `artifactNodes` with
`ArtifactNode[]` tree structure instead.

https://claude.ai/code/session_0159cN1G8652uSjLRFT4SRvJ

### Features

* remove flat artifacts API, require artifact tree nodes ([48a5209](https://github.com/lukeashford/aurelius/commit/48a5209ed88ae4b03d9904bf7d8daa8c8017245a))

## [2.21.0](https://github.com/lukeashford/aurelius/compare/v2.20.0...v2.21.0) (2026-03-23)

### Features

* add tree-aware navigation to ArtifactsPanel ([8fb6ce5](https://github.com/lukeashford/aurelius/commit/8fb6ce54da317a5183b8a3d359f27f55d07f99cf))
* **components:** add ArtifactGroup and ArtifactVariantStack components ([c38dfb0](https://github.com/lukeashford/aurelius/commit/c38dfb0acabce129eead3a10091d3ee5e279481c))
* **components:** add onChoose with async spinner, tests for artifact tree ([2facf33](https://github.com/lukeashford/aurelius/commit/2facf338be2739621c8bb8d4009bce6c8fcabfdf))
* intellij-style tool panel system with sidebar, height dragger, and animations ([c5075c4](https://github.com/lukeashford/aurelius/commit/c5075c4ed5f51d7b9486f78347966bae3fe5f16f))
* sequential artifact tree streaming and group badge animation ([c8bb36a](https://github.com/lukeashford/aurelius/commit/c8bb36a1b3509a241c3401e77614a1d6e4f7d48c))

### Bug Fixes

* **components:** fix group stack layering and modal height ([41b959a](https://github.com/lukeashford/aurelius/commit/41b959ac0a736af22708bd880b3856e7799856eb))
* **components:** fix modal scroll, remove header separator (wip) ([985cca7](https://github.com/lukeashford/aurelius/commit/985cca70c514702d6c1dc4f4138bbe30a3f5aaf1))
* **components:** replace Card.Header with plain h3 to remove separator ([9ac01f5](https://github.com/lukeashford/aurelius/commit/9ac01f512bf1cda18265444e5087e04d32c453f7))
* **components:** simplify ArtifactVariantStack API and clean up demo ([047b38b](https://github.com/lukeashford/aurelius/commit/047b38bfec18e8ee468b9937c6ccd634923590cb))
* remove history button, constant sidebar width, single-column artifacts ([f77c8fb](https://github.com/lukeashford/aurelius/commit/f77c8fb53ba3437a11631c1db0679f5267bd2335))
* remove history placeholder, visible height dragger, respect user-dismissed tools ([3e759dc](https://github.com/lukeashford/aurelius/commit/3e759dc266c4a95ee538eea9454fca337539c8eb))
* resolve test type errors, stale assertions, and demo lint issue ([d205ee0](https://github.com/lukeashford/aurelius/commit/d205ee03e1a497170692728ecce7f8b23ebd4fbe))
* use correct button selector in collapse artifacts panel test ([f8f8f20](https://github.com/lukeashford/aurelius/commit/f8f8f200101cce21fb929a686bb0995fefae6707))
* use correct button selector in collapse artifacts panel test ([#35](https://github.com/lukeashford/aurelius/issues/35)) ([3a9683b](https://github.com/lukeashford/aurelius/commit/3a9683b5adebba0923b703def0fa906c853d3ffe))
* use transform scale for true artifact zoom instead of CSS zoom ([f78f1f8](https://github.com/lukeashford/aurelius/commit/f78f1f8658f288917d6bbb7328e16fd348182228))

## [2.20.0](https://github.com/lukeashford/aurelius/compare/v2.19.0...v2.20.0) (2026-02-27)

### Features

* **components:** standardize prop naming for loading state ([951afd5](https://github.com/lukeashford/aurelius/commit/951afd5e23f093a7ba26b6c9a054c2489d5dd56a))

### Bug Fixes

* **chat:** adjust markdown detection for artifact mime types ([bd18155](https://github.com/lukeashford/aurelius/commit/bd181555b47d8f5c5267f3cdf9eb234a016a37a9))

## [2.19.0](https://github.com/lukeashford/aurelius/compare/v2.18.0...v2.19.0) (2026-02-18)

### Features

* **chat:** auto-open panel on significant artifacts or tasks changes ([87544b2](https://github.com/lukeashford/aurelius/commit/87544b277a85d929de75a08940c190d175c681a3))
* **chat:** auto-open panel on significant artifacts or tasks changes ([#33](https://github.com/lukeashford/aurelius/issues/33)) ([761015b](https://github.com/lukeashford/aurelius/commit/761015bb05d7942099b7c5ee8eeda32e05e8ae9e))

## [2.18.0](https://github.com/lukeashford/aurelius/compare/v2.17.0...v2.18.0) (2026-02-18)

### Features

* **core:** standardize artifact and task type definitions ([424c1f4](https://github.com/lukeashford/aurelius/commit/424c1f45297f4b933f548900cffdea3a760f53c8))
* **core:** standardize artifact and task type definitions ([#32](https://github.com/lukeashford/aurelius/issues/32)) ([b2a6208](https://github.com/lukeashford/aurelius/commit/b2a6208da6bc8696a771e1d9ce7bfed935b61c3f))

## [2.17.0](https://github.com/lukeashford/aurelius/compare/v2.16.0...v2.17.0) (2026-02-17)

### Features

* **card:** refactor card structure ([efdfb69](https://github.com/lukeashford/aurelius/commit/efdfb694080cdfdb900c20fb478d1460978070d2))
* **styles:** add custom ::selection styles for .bg-gold class ([3ad8bde](https://github.com/lukeashford/aurelius/commit/3ad8bde30ec9cc268333e39c6c27b5e17805730f))

## [2.16.0](https://github.com/lukeashford/aurelius/compare/v2.15.1...v2.16.0) (2026-02-15)

### Features

* **app:** add more specialized cards ([999020d](https://github.com/lukeashford/aurelius/commit/999020dbb33c4a148f9c624e8cbc565f97543ef9))
* **app:** add more specialized cards ([#30](https://github.com/lukeashford/aurelius/issues/30)) ([dc2008e](https://github.com/lukeashford/aurelius/commit/dc2008e48f7e6b6386a1cc1e3f5800915fff2eb9))

### Bug Fixes

* **ci:** simplify test workflows and drop react 18 support ([46311c1](https://github.com/lukeashford/aurelius/commit/46311c18f1a175b372f68a2ca62e57773f216dd2))
* **test:** update snapshots, add test:all, correct use of url and inlineContent ([42954e9](https://github.com/lukeashford/aurelius/commit/42954e9fe00695b69e04cd832a6bcb55211302c3))
* **ui:** remove illegal min-height from specialist cards section ([0d0b4c9](https://github.com/lukeashford/aurelius/commit/0d0b4c9ffde2023899e2a84dfd212a8399b55bd2))

## [2.15.1](https://github.com/lukeashford/aurelius/compare/v2.15.0...v2.15.1) (2026-02-15)

### Bug Fixes

* **deps:** upgrade dependencies to rm vulns ([69fb240](https://github.com/lukeashford/aurelius/commit/69fb24076d0ee61369dcd59134193dd680142ff8))
* **deps:** upgrade dependencies to rm vulns ([#29](https://github.com/lukeashford/aurelius/issues/29)) ([2605c2e](https://github.com/lukeashford/aurelius/commit/2605c2ec5b85f28f2047d0fce57150c797674108))

## [2.15.0](https://github.com/lukeashford/aurelius/compare/v2.14.0...v2.15.0) (2026-02-15)

### Features

* **chat:** improve empty state UI and align styles ([8aef267](https://github.com/lukeashford/aurelius/commit/8aef2675ec6274065988af7d31c0c755aecaaf80))
* **chat:** improve empty state UI and align styles ([#28](https://github.com/lukeashford/aurelius/issues/28)) ([74d46b4](https://github.com/lukeashford/aurelius/commit/74d46b4b62f50c91e5afdccbc9f34db738b9dd79))

## [2.14.0](https://github.com/lukeashford/aurelius/compare/v2.13.0...v2.14.0) (2026-02-12)

### Features

* **cards:** add audio card ([0e88ff5](https://github.com/lukeashford/aurelius/commit/0e88ff5211240983540c2ff4cf935a6dc4480d3f))
* **cards:** add audio card ([#27](https://github.com/lukeashford/aurelius/issues/27)) ([d950ab5](https://github.com/lukeashford/aurelius/commit/d950ab5cf1b02fad307d7c4b1299263ce2b4ad2a))

## [2.13.0](https://github.com/lukeashford/aurelius/compare/v2.12.0...v2.13.0) (2026-01-28)

### Features

* **chat:** add TodosList component with task workflow visualization ([7db6d40](https://github.com/lukeashford/aurelius/commit/7db6d40830b971d14233acc703246e48e4464d16))

## [2.12.0](https://github.com/lukeashford/aurelius/compare/v2.11.0...v2.12.0) (2026-01-21)

### Features

* **chat:** add resizable panels and columns adjustment logic ([8bc2136](https://github.com/lukeashford/aurelius/commit/8bc2136305b72cc1f0a0cec0acfb546ba476e636))
* **chat:** add test ids and useResizable hook for resizable panels ([d60fa16](https://github.com/lukeashford/aurelius/commit/d60fa1677db172e08504895d5d1d7b3af2593c50))
* **components:** document new props, features, and usage for chat components ([22295dc](https://github.com/lukeashford/aurelius/commit/22295dc517ba4197e77398d0c2ab7f1f7c8842d4))
* **router:** migrate to react-router-dom with route-based navigation ([4be2cc6](https://github.com/lukeashford/aurelius/commit/4be2cc6e1889cdab157904571240db78feba0c7b))

### Bug Fixes

* **tests:** update navigation paths and add chat-demo view test ([4a9b0c6](https://github.com/lukeashford/aurelius/commit/4a9b0c6fcf902ed8647bd159775fb624a03d4843))

## [2.11.0](https://github.com/lukeashford/aurelius/compare/v2.10.1...v2.11.0) (2026-01-19)

### Features

* **chat:** convert artifact parsing to hooks-based API ([026c1ed](https://github.com/lukeashford/aurelius/commit/026c1ed635f222fbd0f656ea92d219270874b77d))

## [2.10.1](https://github.com/lukeashford/aurelius/compare/v2.10.0...v2.10.1) (2026-01-13)

### Bug Fixes

* **demo:** capture message ID before state callback in handleStop ([e0f71ee](https://github.com/lukeashford/aurelius/commit/e0f71ee78d68b0edce53f18170c6cbc10e24f78a))
* **tests:** fix "can collapse artifacts panel" ([9e5cd9c](https://github.com/lukeashford/aurelius/commit/9e5cd9ceb113c5dd101d544bed90694253da24c9))
* **tests:** fix linter errors ([a2f6de8](https://github.com/lukeashford/aurelius/commit/a2f6de8f75df567bc3cbe5c03a0641c78c1ede83))

## [2.10.0](https://github.com/lukeashford/aurelius/compare/v2.9.0...v2.10.0) (2026-01-12)

### Features

* **build:** add demo linting and refactor lint
  scripts ([b71c30c](https://github.com/lukeashford/aurelius/commit/b71c30ce5600f97f099c8df60d8260f7c2f87243))
* **chat-demo:** improve attachment
  haptics ([b87cada](https://github.com/lukeashford/aurelius/commit/b87cadaa53f3583188beba250647c2785a536ef1))
* **chat-demo:** revise helper text for message actions
  guidance ([a57bff8](https://github.com/lukeashford/aurelius/commit/a57bff81cf697fcd508eefddb46b412efb54ccdd))
* **chat-input:** update layout for responsiveness and animation
  effects ([b6493ad](https://github.com/lukeashford/aurelius/commit/b6493adea43c206b0c9265c8b458966bcba3724a))
* **chat-interface:** enhance section with aurelius components and styling
  adjustments ([c124662](https://github.com/lukeashford/aurelius/commit/c12466205c0174bc4a666844a588c413d8d02897))
* **chat:** add message actions, branching, attachments, and thinking
  indicator ([b9269cc](https://github.com/lukeashford/aurelius/commit/b9269cc39e272a34ca44c9a7769537b0b2117650))
* **chat:** add production-grade chat interface
  components ([a16ceb1](https://github.com/lukeashford/aurelius/commit/a16ceb1fb0b9ccd24be221b3d8eefb6cc4cade22)),
  closes [#chat-demo](https://github.com/lukeashford/aurelius/issues/chat-demo)
* **chat:** implement adaptive spacer for precise viewport
  fill ([3013a5b](https://github.com/lukeashford/aurelius/commit/3013a5bbc72c34baea5978e568b26a83f32ca120))
* **chat:** improve panel UX with symmetric toggle
  behavior ([d0f9261](https://github.com/lukeashford/aurelius/commit/d0f92615228c97850e1d48f547119d6e136c42a0))
* **chat:** improve scroll anchoring and thinking indicator
  variety ([0b84f30](https://github.com/lukeashford/aurelius/commit/0b84f3089e3ecd6a7e77b0d4a3fda6e5a1a64015))
* **styles:** adjust fonts for same
  size ([e90243d](https://github.com/lukeashford/aurelius/commit/e90243d4cbaa0e72e77f960219b8dfdeacc3b668))
* **styles:** reset default color variables in
  theme ([7f737bf](https://github.com/lukeashford/aurelius/commit/7f737bfb96f149d357df675f975ad9e16d74fed8))

### Bug Fixes

* add flex-zero utility for proper collapse
  behavior ([4457564](https://github.com/lukeashford/aurelius/commit/445756443971579644360b00848acbae43ebe326))
* **artifacts:** persist artifacts after streaming ends and fix demo page
  issues ([f91c40a](https://github.com/lukeashford/aurelius/commit/f91c40ab14738411bfd6db6d99db6e9762a850a1))
* **artifacts:** use stable IDs and improve demo
  streaming ([98dc23e](https://github.com/lukeashford/aurelius/commit/98dc23e0273a16e946b04b0cf37ebc4b29496027))
* **chat-view:** show actions on all non-streaming
  messages ([c5e6cb4](https://github.com/lukeashford/aurelius/commit/c5e6cb407453fac6d31de805b917de6010c69c34))
* **chat:** add position relative to content wrapper for reliable
  offsetTop ([aaf4a53](https://github.com/lukeashford/aurelius/commit/aaf4a53a7c18bc41dedc1ca8bfe0b2a3e4dacf49))
* **chat:** address UI feedback and enforce square
  corners ([acc8141](https://github.com/lukeashford/aurelius/commit/acc81416aa723b1d58272b45d23ec6fb608cbef8))
* **chat:** calculate spacer based on anchor
  position ([ad5279c](https://github.com/lukeashford/aurelius/commit/ad5279c97f60601eef056688521f324700cf8a36))
* **chat:** ensure spacer updates before scroll for subsequent
  messages ([821b66e](https://github.com/lukeashford/aurelius/commit/821b66e06eb6f523c0eb456c5aa0f17b69fa61cc))
* **chat:** improve message actions and edit
  UX ([4f281ee](https://github.com/lukeashford/aurelius/commit/4f281eed9aa42ad6bcdd57b18e7e2caf8f6bc362))
* **chat:** inject streaming cursor inside markdown
  content ([cb624a2](https://github.com/lukeashford/aurelius/commit/cb624a20c24edfc7e61e9fbf72aea63a057e663a))
* **chat:** prevent cursor pulsing after Stop by not spreading node
  isStreaming ([d2d4472](https://github.com/lukeashford/aurelius/commit/d2d44724b12d102cb26ae7043f5cd5f041a4960f))
* **chat:** use offsetTop for stable anchor
  measurement ([e8f8336](https://github.com/lukeashford/aurelius/commit/e8f8336b2a2375d2d005c2143afb9cd7db6b2c7b))
* **ci:** use lint:core in release workflow to match test
  workflow ([13f88e5](https://github.com/lukeashford/aurelius/commit/13f88e5807f54590d9c9d5b3d3c8c06bd9df58ad))
* **ci:** use lint:core in release workflow to match test
  workflow ([#21](https://github.com/lukeashford/aurelius/issues/21)) ([1d097e4](https://github.com/lukeashford/aurelius/commit/1d097e4ccd6a3b6dcec27bc3c4840855c5ccb9b3))
* **e2e:** adjust to new
  features ([34b048c](https://github.com/lukeashford/aurelius/commit/34b048ca908d8aba548bc71fda24d049b9906cb7))
* resolve linting errors and update snapshots for new
  features ([954e771](https://github.com/lukeashford/aurelius/commit/954e771c8ab122e309aa1566f9256557f718540b))
* **video-cards:** lint
  error ([3997d28](https://github.com/lukeashford/aurelius/commit/3997d28e74ee98edb6efffe491dfd7de73a02e55))

## [2.9.0](https://github.com/lukeashford/aurelius/compare/v2.8.0...v2.9.0) (2026-01-10)

### Features

* **docs:** update setup instructions with vite-specific
  config ([5e1be8b](https://github.com/lukeashford/aurelius/commit/5e1be8b58dccb3f25ecacf3b21b56a600707c2eb))
* **docs:** update setup instructions with vite-specific
  config ([#19](https://github.com/lukeashford/aurelius/issues/19)) ([ca25924](https://github.com/lukeashford/aurelius/commit/ca2592406ce3a0c8b4bc453bd123b4331be18fb7))

## [2.8.0](https://github.com/lukeashford/aurelius/compare/v2.7.0...v2.8.0) (2026-01-09)

### Features

* **docs:** document VideoCard props in
  llms.md ([09a2f86](https://github.com/lukeashford/aurelius/commit/09a2f86770d3c0388ecd75eb9b0d5306c28b3df8))
* **video-cards:** add video card section with react-player
  integration ([82ea1e1](https://github.com/lukeashford/aurelius/commit/82ea1e168db8c0f74a55ba1764a324a78fd47678))

### Bug Fixes

* **cards:** image card bottom
  pad ([3249f77](https://github.com/lukeashford/aurelius/commit/3249f77693001ca80039a10f1032f8dc81107281))

## [2.7.0](https://github.com/lukeashford/aurelius/compare/v2.6.0...v2.7.0) (2026-01-09)

### Features

* **styles:** add
  twMerge ([87e23aa](https://github.com/lukeashford/aurelius/commit/87e23aa05393d82655907af314f18be4c827fb4e))
* **styles:** add
  twMerge ([#17](https://github.com/lukeashford/aurelius/issues/17)) ([1198a99](https://github.com/lukeashford/aurelius/commit/1198a99e341c749dbd2744fdf27213bc85012efd))

## [2.6.0](https://github.com/lukeashford/aurelius/compare/v2.5.0...v2.6.0) (2026-01-07)

### Features

* **ui:** rm ChatHistory styling
  div ([0829504](https://github.com/lukeashford/aurelius/commit/08295046521be25b549258a63e05c9add96255d6))

### Bug Fixes

* **components:** replace utility functions with class mapping
  objects ([10d860e](https://github.com/lukeashford/aurelius/commit/10d860edc71c21fa7b564b0964cdb10db6b6f2f3))
* **tests:** update message section snapshot and adjust message
  styling ([3607976](https://github.com/lukeashford/aurelius/commit/36079761ca45d15bf2e965a24e6b35a2d8058e6e))

## [2.5.0](https://github.com/lukeashford/aurelius/compare/v2.4.0...v2.5.0) (2025-12-25)

### Features

* **docs:** add lint script setup instructions to
  readme ([eb5a77e](https://github.com/lukeashford/aurelius/commit/eb5a77e11a0e241aa8476f98c63251ffa246ab2d))
* **docs:** add lint script setup instructions to
  readme ([#15](https://github.com/lukeashford/aurelius/issues/15)) ([5cd7d84](https://github.com/lukeashford/aurelius/commit/5cd7d841543a9464480df79f1a8a8cb69d619bc9))

## [2.4.0](https://github.com/lukeashford/aurelius/compare/v2.3.0...v2.4.0) (2025-12-25)

### Features

* **styles:** update gold color for improved palette
  consistency ([ee4102b](https://github.com/lukeashford/aurelius/commit/ee4102b36a76241a92efafaa195e34f429ae084e))
* **styles:** update gold color for improved palette
  consistency ([#14](https://github.com/lukeashford/aurelius/issues/14)) ([c3ae445](https://github.com/lukeashford/aurelius/commit/c3ae445352a19e668abfafdf24e21d4dc43e8e1e))

## [2.3.0](https://github.com/lukeashford/aurelius/compare/v2.2.0...v2.3.0) (2025-12-24)

### Features

* **components:** major component library expansion with 17 new
  components ([6bed535](https://github.com/lukeashford/aurelius/commit/6bed535a866ef0f4761dc741f8671ce930c02f84))
* **demo:** expand demo coverage for all new
  components ([4f31f24](https://github.com/lukeashford/aurelius/commit/4f31f24733361bec6f003ea2c4bbd9bf74ed722d))
* **layout:** add Container, Row, Col components and CSS grid
  system ([bfe460d](https://github.com/lukeashford/aurelius/commit/bfe460da1b9c842183e4351bd64a7e071e9a97d9))
* **layout:** enhance layout system with full Bootstrap
  parity ([47d4e44](https://github.com/lukeashford/aurelius/commit/47d4e448b95838efd417994e02c51fc8102f4f84))
* **scripts:** add test command to
  package.json ([c110b3e](https://github.com/lukeashford/aurelius/commit/c110b3e7fb4c61b73bc8a1ebdd40ede066e40f86))
* **styles:** add derived CSS custom props and layout
  tokens ([c52cab0](https://github.com/lukeashford/aurelius/commit/c52cab0516dc145d6e390ad156190c72b7cc4980))
