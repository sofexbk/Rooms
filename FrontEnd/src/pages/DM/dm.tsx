import { Dashboard } from "./dashboard";

export default function DM() {
 
  const layoutCookie = document.cookie.match(/react-resizable-panels:layout=([^;]+)/);
  const collapsedCookie = document.cookie.match(/react-resizable-panels:collapsed=([^;]+)/);
  
  // Initialize defaultLayout and defaultCollapsed to undefined
  let defaultLayout, defaultCollapsed;

  // If layoutCookie exists, decode and parse it
  if (layoutCookie) {
    try {
      defaultLayout = JSON.parse(decodeURIComponent(layoutCookie[1]));
    } catch (error) {
      console.error("Error parsing layout cookie:", error);
    }
  }
  // If collapsedCookie exists, decode and parse it
  if (collapsedCookie) {
    try {
      defaultCollapsed = JSON.parse(decodeURIComponent(collapsedCookie[1]));
    } catch (error) {
      console.error("Error parsing collapsed cookie:", error);
    }
  }

  return (
    <>
      <div className="hidden flex-col md:flex max-h-screen">
        <Dashboard
          defaultLayout={defaultLayout}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
