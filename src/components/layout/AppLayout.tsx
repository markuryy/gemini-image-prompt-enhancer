'use client';

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'blue',
  });

  return (
    <>
      <ColorSchemeScript />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          {children}
        </main>
      </MantineProvider>
    </>
  );
}
