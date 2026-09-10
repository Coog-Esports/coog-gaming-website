"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addTeamMember } from "@/server/team-members";

import type {
  DashboardMember,
  DashboardTeam,
} from "../games-dashboard";

type AddTeamMemberProps = {
  team: DashboardTeam;
  members: DashboardMember[];
};

function memberLabel(member: DashboardMember) {
  const name = [
    member.user.firstName,
    member.user.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return [
    name,
    member.user.gamerName && `"${member.user.gamerName}"`,
  ]
    .filter(Boolean)
    .join(" ") || "Unnamed Member";
}

export default function AddTeamMember({
  team,
  members,
}: AddTeamMemberProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMember, setSelectedMember] =
    useState<DashboardMember | null>(null);
  const [adding, setAdding] = useState(false);

  const availableMembers = members.filter(
    (member) =>
      !team.members.some(
        (teamMember) => teamMember.id === member.id,
      ),
  );

  const matchingMembers = availableMembers.filter((member) =>
    memberLabel(member)
      .toLowerCase()
      .includes(debouncedSearch),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  function reset() {
    setSearch("");
    setDebouncedSearch("");
    setSelectedMember(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  async function handleAddMember() {
    if (!selectedMember) return;

    setAdding(true);

    try {
      const { error } = await addTeamMember({
        teamId: team.id,
        memberId: selectedMember.id,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Member added to team");
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to add member");
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={`Add member to ${team.name}`}
      >
        <UserPlus className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "Add Team Member" : "Select Member"}
            </DialogTitle>

            <DialogDescription>
              {selectedMember
                ? `Add ${memberLabel(selectedMember)} to ${team.name}.`
                : `Select a member to add to ${team.name}.`}
            </DialogDescription>
          </DialogHeader>

          {availableMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All available members are already on this team.
            </p>
          ) : selectedMember ? (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMember(null)}
                disabled={adding}
              >
                Back
              </Button>

              <Button onClick={handleAddMember} disabled={adding}>
                {adding ? "Adding..." : "Add Member"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or gamer name..."
                aria-label="Search members"
              />

              <div className="max-h-60 overflow-y-auto rounded-md border p-1">
                {matchingMembers.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    No available members found.
                  </p>
                ) : (
                  matchingMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className="
                        block w-full rounded-sm px-3 py-2 text-left text-sm
                        hover:bg-accent focus:bg-accent focus:outline-none
                      "
                    >
                      {memberLabel(member)}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}