import React from 'react';
import { PageContextProvider } from './context/PageContextProvider';
import PageComponent from './PageComponent/PageComponent';

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => (
  <PageContextProvider>
    <PageComponent>
      {children}
    </PageComponent>
  </PageContextProvider>
);

export { Page };
export default Page;