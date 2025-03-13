import AppBar from "@/components/section/appbar";
import Container from "@/components/section/container";
import Recent from "@/components/section/recent";
import AICreativeSuite from "@/components/section/workflow";
import { getInitialLogos, getOrCreateUser } from "@/lib/action";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getOrCreateUser();
  const recentLogos = await getInitialLogos(3);
  return (
    <Container>
      <AppBar />
      <AICreativeSuite user={user} />
      <Recent recentLogos={recentLogos.logos} />
    </Container>
  );
}
