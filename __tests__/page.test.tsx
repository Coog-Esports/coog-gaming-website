// this is the test for the homepage


import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Page from "../app/page";
import VisitorCalendar from "@/components/site-components/homepage-components/visitor-calendar/visitor-calendar";
import TwitchEmbed from "@/components/site-components/homepage-components/twitch-embed";
import TwitterEmbed from "@/components/site-components/homepage-components/twitter-embed";
import type { Event } from "@/db/schema";

// we need this line here as this prevents our twitter component from calling the twitter api through its script tag
// this esssentially emulates that functionality, but does not return anything, so we need to test the heading and link
jest.mock("next/script", () => ({
  __esModule: true,
  default: function MockScript() {
    return null;
  },
}));

// Return mock event data instead of querying the database.
jest.mock("@/server/events", () => ({
  getEvents: jest.fn().mockResolvedValue({
    data: [],
    error: null,
  }),
}));

describe("Home Page", () => {
  it("renders a heading", async () => {
    render(await Page());
    const heading = screen.getByTestId("welcome-heading");
    expect(heading).toBeInTheDocument();
  });

  it("renders the calendar", () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const mockEvents: Event[] = [
      {
        id: "11111111-1111-4111-8111-111111111111",
        title: "Smash Bros Tournament",
        location: "Student Center",
        startDate: new Date(year, month, 15, 14, 0),
        endDate: new Date(year, month, 15, 16, 0),
        description: "A friendly Smash Bros tournament.",
        createdBy: null,
        createdAt: null,
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        title: "Valorant Game Night",
        location: "Gaming Lab",
        startDate: new Date(year, month, 15, 18, 0),
        endDate: new Date(year, month, 15, 20, 0),
        description: "An evening of Valorant with the club.",
        createdBy: null,
        createdAt: null,
      },
    ];

    // tests to see if we can render the calendar with two events
    render(<VisitorCalendar events={mockEvents} />);
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
    // test to see if we can render the sidebar click functionality
    fireEvent.click(screen.getByText("15", { exact: true }));
    // the aside used for the sidebar has the role complementary by default, so we can auto get the sidebar by doing this
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeVisible();
    expect(
      within(sidebar).getByRole("heading", { level: 3, name: /15$/ }),
    ).toBeInTheDocument();
    // tests to see if the sidebar has the two events we rendered as buttons
    expect(
      within(sidebar).getByRole("button", { name: /Smash Bros Tournament/ }),
    ).toBeVisible();
    expect(
      within(sidebar).getByRole("button", { name: /Valorant Game Night/ }),
    ).toBeVisible();
  });

  it("renders the twitch componenet", () => {
    render(<TwitchEmbed />);
    expect(
      screen.getByRole("heading", { name: "Coog Esports Live" }),
    ).toBeInTheDocument();
    // this title is from the iframe title
    const player = screen.getByTitle("coog esports stream");
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute(
      "src",
      expect.stringContaining("https://player.twitch.tv/?channel=coogesports"),
    );
  });

  it("renders the twitter component", () => {
    render(<TwitterEmbed />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Visit The Arena" }),
    ).toBeInTheDocument();
    const tweetLink = screen.getByRole("link", { name: "February 5, 2025" });
    expect(tweetLink).toBeInTheDocument();
    expect(tweetLink).toHaveAttribute(
      "href",
      "https://x.com/coogesports/status/1887204956739956825?ref_src=twsrc%5Etfw",
    );
  });
});
