# Solar Intelligence — Cinematic Launch Package

## Deliverable

- Duration: 3.6 seconds
- Aspect ratio: 16:9
- Delivery resolution: 1920 × 1080
- Frame rate: 30 fps
- Output: H.264 MP4, web optimized, muted/no audio track
- Intended destination: `/videos/projects/solar/solar-launch.mp4`
- Do not replace the current launch asset until a final take has been reviewed and selected.

## Reference frames

- Opening frame: `solar-start.webp`
- Handoff frame: `solar-end.webp`

The first frame establishes the physical rooftop installation. The final frame is the visual contract with the React project hero: centered solar-panel region, deep graphite surroundings, restrained cyan detail, and clean negative space.

## Shot timeline

| Time | Beat | Direction |
| --- | --- | --- |
| 0.00–0.75s | Physical installation | Begin above a real modern rooftop solar array at late golden hour / early blue hour. Hold a stable establishing composition, then begin a precise forward dolly. |
| 0.75–1.85s | Intelligence emerges | Continue the controlled forward movement. Introduce only subtle cyan energy traces, faint grid geometry, and sparse data particles moving across the panel surfaces. The real installation remains dominant. |
| 1.85–2.85s | Environment transforms | Gradually simplify the rooftop and sky into deep graphite, obsidian, and blue-black gradients. Preserve the panel geometry and camera direction while the physical scene becomes a premium analytical workspace. |
| 2.85–3.60s | UI handoff hold | Settle on the centered final composition. The main rectangular solar-panel/dashboard-like region is stable with negative space around it. No camera movement during the final 0.75 seconds. |

## Camera and continuity

- One continuous shot; no cuts, zoom jumps, orbiting, shake, or speed ramps.
- Smooth cinematic dolly forward with slow acceleration and precise stabilization.
- Preserve believable rooftop scale and undistorted photovoltaic-panel geometry.
- Use a natural architectural-commercial lens perspective, approximately 35–50 mm full-frame equivalent.
- Keep the central panel region aligned throughout the final transition so it can match the project hero without a visible spatial jump.
- The final 0.75 seconds must be effectively motionless apart from extremely subtle ambient light.

## Generation prompt

Create a premium cinematic launch transition for an advanced solar intelligence software project. The film is photorealistic, clean, minimal, sophisticated, and grounded in real-world engineering—not science fiction or cyberpunk.

Begin above a modern rooftop solar installation during late golden hour transitioning toward early blue hour. Large photovoltaic panels appear in clean geometric rows with authentic rooftop construction, natural reflections, subtle atmospheric depth, a realistic sky, and the finish of high-end architectural photography. Move the camera forward smoothly and precisely toward the array.

As the camera approaches, add very subtle analytical cues integrated into the physical scene: soft cyan energy traces, minimal data particles, faint grid geometry, and restrained light paths moving across panel surfaces. These elements should read as intelligent data visualization layered onto reality. Do not let them overpower the solar installation.

During the final second, gradually transform the environment into a dark premium analytical workspace. Simplify the composition and settle the camera centrally. A large rectangular solar-panel or dashboard-like visual region occupies the center while the surroundings fade into deep graphite, obsidian black, subtle blue-black gradients, and restrained electric-cyan highlights. Leave clean negative space around the main visual.

The final frame is stable, clean, centered, minimal, and dark, designed to transition seamlessly into a real React interface. Hold this composition without camera movement for the final 0.6–0.8 seconds. No text, logos, or people.

## Negative prompt

cyberpunk, neon overload, sci-fi holograms, fake dashboard, readable generated text, numbers, logos, people, robots, spaceships, floating screens, glitch effects, camera shake, rapid cuts, warped solar panels, surreal architecture, cartoon, anime, overexposed lens flare, excessive particles, excessive glow, extreme lens effects

## Acceptance criteria

- Photorealistic installation and structurally believable panels in every frame.
- A single smooth forward camera move with no cuts or discontinuity.
- Analytical graphics stay restrained and contain no readable text, numbers, charts, or UI.
- Natural golden-hour-to-graphite lighting transition.
- Final composition matches `solar-end.webp` in framing, palette, focal point, and negative space.
- Final 0.6–0.8 seconds are stable enough for a frame-accurate UI handoff.
- No audio is required; delivery will be muted and `playsInline` in the browser.

## STATO OS handoff contract

```js
launch: {
  mode: 'cinematic',
  video: '/videos/projects/solar/solar-launch.mp4',
  poster: '/videos/projects/solar/solar-launch-poster.webp',
  openAt: 3.0,
  maxDuration: 4800,
  handoff: {
    target: 'project-hero',
    background: '#05080d',
    focalPoint: 'center'
  }
}
```

`openAt` is provisional. After the selected Higgsfield take is exported, measure the exact start of the stable final hold and update the value before replacing the current launch video. `maxDuration` remains the safety fallback; media errors must continue to use the fast standard transition.

## Selection workflow

1. Generate multiple Higgsfield takes using both reference frames and this timing spec.
2. Reject takes with panel deformation, generated UI/text, camera instability, or an unstable final hold.
3. Select the take with the strongest physical-to-digital continuity.
4. Export and optimize for the web without changing duration or frame cadence.
5. Measure the final-hold timestamp and update `openAt`.
6. Replace the production video only after visual review in STATO OS on desktop, mobile, and reduced-motion paths.
