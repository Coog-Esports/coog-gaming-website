// this is for the about page

import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import Page from "@/app/about/page";
import { getPublicAdmins } from "@/server/admins";

// Replace the database action with a mock.
jest.mock("@/server/admins", () => ({
  getPublicAdmins: jest.fn().mockResolvedValue({
    data: [],
    error: null,
  }),
}));

describe("About Page", () => {
  it("renders the about section", async () => {
    render(await Page());
    const section = screen.getByTestId("about-section");
    expect(section).toBeInTheDocument();
  });

  it("makes sure all the admins are on the page", async () => {
    // These correspond to role values 0–10 in the schema.
    const expectedRoles = [
      "President",
      "VP",
      "Treasurer",
      "Secretary",
      "Esports Director",
      "Board Game Manager",
      "Tabletop Manager",
      "TCG Manager",
      "Event Manager",
      "Sponsorship Manager",
      "Officer"
    ];

    // Create one mock admin for each role.
    const mockAdmins = expectedRoles.map((_, index) => ({
      admin: {
        id: `admin-${index + 1}`,
        role: index,
      },
      member: {
        firstName: "Admin",
        lastName: `${index + 1}`,
        gamerName: null,
        avatarUrl: null,
      },
    }));

    jest.mocked(getPublicAdmins).mockResolvedValueOnce({
      data: mockAdmins,
      error: null,
    });

    render(await Page());

    // Limit our checks to the leadership section.
    const leadership = screen.getByRole("region", {
      name: "Club Leadership",
    });

    // Each admin card is an <li>, which has the role "listitem".
    const adminCards = within(leadership).getAllByRole("listitem");
    expect(adminCards).toHaveLength(11);

    // Check each card's visibility, admin name, and role.
    adminCards.forEach((card, index) => {
      expect(card).toBeVisible();

      expect(
        within(card).getByRole("heading", {
          level: 3,
          name: `Admin ${index + 1}`,
        }),
      ).toBeVisible();

      expect(
        within(card).getByText(expectedRoles[index], { exact: true }),
      ).toBeVisible();
    });
  });
});
