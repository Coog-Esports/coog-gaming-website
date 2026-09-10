import Header from "@/components/site-components/admin-components/events-calendar/header/header";
import MainView from "@/components/site-components/admin-components/events-calendar/body/main-view";
import { getEvents } from "@/server/events";

export default async function page() {
  const { data: events } = await getEvents();

  return (
    <div>
      <Header />
      <MainView events={events ?? []}/>
    </div>
  );
}
