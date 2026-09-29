// Re-mounted on every navigation, so the CSS entrance animation replays per page
// without any client-side JavaScript.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="alliet-page-in flex-grow flex flex-col">{children}</div>;
}
