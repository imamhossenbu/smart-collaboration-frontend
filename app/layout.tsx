import { ReduxProvider } from "@/redux/provider";
import "../app/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Toaster />

          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
