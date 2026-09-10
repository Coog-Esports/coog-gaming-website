// this is the test for the teampage

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { getGamesWithTeamsAndMembers } from "@/server/games";
import Page from "@/app/teams/page";

// Return mock team data instead of querying the database.
jest.mock("@/server/games", () => ({
  getGamesWithTeamsAndMembers: jest.fn().mockResolvedValue({
    data: [],
    error: null,
  }),
}));

describe("Team Page", () => {
  it("renders the teampage heading", async () => {
    render(await Page());
    const header = screen.getByTestId("teams-header");
    expect(header).toBeInTheDocument();
  });

  it("shows a game, its team, and three members when expanded", async () => {
    const memberNames = [
      { firstName: "Alex", lastName: "Smith" },
      { firstName: "Jordan", lastName: "Lee" },
      { firstName: "Taylor", lastName: "Brown" },
    ];

    const mockMembers = memberNames.map((name, index) => ({
      id: `member-${index + 1}`,
      userId: `user-${index + 1}`,
      user: {
        firstName: name.firstName,
        lastName: name.lastName,
        gamerName: null,
        avatarUrl: null,
      },
    }));

    // Supply one game containing one team with three members.
    // jest.mocked simulates the getGamesWithTeamsAndMembers function and lets TypeScript recog as a jest mock
    // mockResolved sets the data
    // so when we await page it calls this function and awaits the mock data we created
    jest.mocked(getGamesWithTeamsAndMembers).mockResolvedValueOnce({
      data: [
        {
          id: "game-1",
          name: "Valorant",
          imageUrl: null,
          teams: [
            {
              id: "team-1",
              gameId: "game-1",
              name: "Coog Red",
              members: mockMembers,
            },
          ],
        },
      ],
      error: null,
    });
    render(await Page());
    // The game should be visible before either dropdown is opened.
    const gameHeading = screen.getByRole("heading", {
      level: 2,
      name: "Valorant",
    });
    expect(gameHeading).toBeVisible();
    // The team starts hidden inside the game's dropdown.
    const teamName = screen.getByText("Coog Red", { exact: true });
    expect(teamName).not.toBeVisible();
    // Open the game dropdown to reveal the team.
    fireEvent.click(gameHeading);
    expect(teamName).toBeVisible();
    // The roster should still be hidden until the team is expanded.
    for (const member of memberNames) {
      expect(
        screen.getByText(`${member.firstName} ${member.lastName}`),
      ).not.toBeVisible();
    }
    // Open the team dropdown.
    fireEvent.click(teamName);
    // Check the displayed member count and all three names
    expect(screen.getByText("3 members", { exact: true })).toBeVisible();
    for (const member of memberNames) {
      expect(
        screen.getByText(`${member.firstName} ${member.lastName}`),
      ).toBeVisible();
    }
  });
});
