"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "../../lib/store";
import { useSyncStateWithUrl } from "../../lib/urlParams";
import { Header } from "./components/Header/Header";
import { useSiteHasData, useGetSite } from "../../api/admin/sites";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { useWindowSize } from "@uidotdev/usehooks";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setSite, site } = useStore();
  const { data: siteHasData, isLoading } = useSiteHasData(site);

  const { data: siteMetadata, isLoading: isLoadingSiteMetadata } =
    useGetSite(site);

  // Sync store state with URL parameters
  useSyncStateWithUrl();

  useEffect(() => {
    if (pathname.includes("/") && pathname.split("/")[1] !== site) {
      setSite(pathname.split("/")[1]);
    }
  }, [pathname]);

  const { width } = useWindowSize();

  if (!site) {
    return null;
  }

  if (isLoadingSiteMetadata || isLoading || !siteMetadata) {
    return null;
  }

  if (width && width < 768) {
    return (
      <div className="">
        <TopBar />
        <Header />
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <div>
            {/* <div className="px-4 py-2 max-w-[1400px] mx-auto w-full mb-4"> */}
            <Header />
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
