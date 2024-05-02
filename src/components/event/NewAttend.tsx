import { type Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { type User, type Event } from "@prisma/client";
import { api } from "../../utils/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  session: Session | null;
  event: Event & {
    host: User;
  };
};

export const NewAttend = ({ session, event }: Props) => {
  if (!session) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Attend session={session} event={event} />
          <Attendants event={event} />
        </div>
      </CardContent>
    </Card>
  );
};

type AttendProps = { session: Session; event: Event & { host: User } };

const Attend = ({ session, event }: AttendProps) => {
  const updateAttendance = async (status: "GOING" | "NOT_GOING" | "MAYBE") => {
    console.log(status, event.publicId, session.user.id);
    setTimeout(() => console.log("hello"), 2000);
  };

  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger className="w-full">Going?</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you going to {event.title}?:</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => updateAttendance("GOING")}
            >
              Going
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => updateAttendance("MAYBE")}
            >
              Maybe
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => updateAttendance("NOT_GOING")}
            >
              Not going
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type AttendantsProps = { event: Event & { host: User } };

const Attendants = ({ event }: AttendantsProps) => {
  const { data: attendees, isSuccess } = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>
          {attendees?.filter((a) => a.status === "GOING")?.length ?? 0} going
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees:</DialogTitle>
        </DialogHeader>
        {isSuccess &&
          attendees.map((attendee) => (
            <p key={attendee.attendeeId}>
              {attendee.name} {attendee.status === "NOT_GOING" && "(not going)"}
            </p>
          ))}
      </DialogContent>
    </Dialog>
  );
};
