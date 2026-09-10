import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/profile/page";
import { db } from "@/db";
import type { User } from "@/db/schema/users";
import { getAuthenticatedUser } from "@/server/auth";

jest.mock("@/server/auth", () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock("@/db", () => ({
  db: {
    query: {
      users: { findFirst: jest.fn() },
    },
  },
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: "11111111-1111-4111-8111-111111111111",
            email: "alex@example.com",
          },
        },
        error: null,
      }),
    },
  }),
}));

// The real cards call useRouter during rendering.
jest.mock("next/navigation", () => ({
  useRouter: () => ({}),
}));

// Prevent server and browser-client dependencies from loading.
jest.mock("@/server/nonAdminUsers", () => ({}));
jest.mock("@/lib/supabase/client", () => ({}));

describe("Profile Page", () => {
  it("shows first name, last name, and gamer name in ProfileInformationCard", async () => {
    const mockProfile: User = {
      id: "11111111-1111-4111-8111-111111111111",
      email: "alex@example.com",
      firstName: "Alex",
      lastName: "Smith",
      gamerName: "CoogChampion",
      avatarUrl: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    jest.mocked(getAuthenticatedUser).mockResolvedValueOnce({
      id: mockProfile.id,
      email: mockProfile.email,
    });
    jest.mocked(db.query.users.findFirst).mockResolvedValueOnce(mockProfile);
    render(await Page());
    const expectedFields = [
      { label: "First name", value: mockProfile.firstName },
      { label: "Last name", value: mockProfile.lastName },
      { label: "Gamer Name", value: mockProfile.gamerName },
    ];
    for (const { label, value } of expectedFields) {
      const input = screen.getByRole("textbox", {
        name: label
      });
      expect(input).toBeVisible();
      expect(input).toHaveValue(value);
    }
  });
});