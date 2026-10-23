/**
 * Fixed aurora wash behind the whole app. Purely decorative, so it is hidden
 * from assistive tech and ignores pointer events.
 */
export default function AuroraBackground() {
  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
